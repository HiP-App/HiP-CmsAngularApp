import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';

import { CmsApiService } from '../core/api/cms-api.service';
import { Tag } from './tag.model';
import { OOApiService } from '../core/api/oo-api.service';

/**
 * Data service for the tagging system. Holds a local copy of all tags
 * and performs tag management actions both locally and on the server.
 * Local tag cache is kept up to date with the server state and is exposed
 * as an Observable.
 */
@Injectable()
export class TagService {
  private tagCache: BehaviorSubject<Tag[]> = new BehaviorSubject([]);
  public tags = this.tagCache.asObservable();

  constructor(private cmsApiService: CmsApiService,
              private ooApiService: OOApiService) {
    this.getAllTags()
      .then(tags => this.tagCache.next(tags))
      .catch(error => this.tagCache.error(error));
  }

  /**
   * Creates a new tag.
   * @returns {Promise<number>} id of the created tag.
   */
  createTag(tag: Tag): Promise<number> {
     return this.cmsApiService.postUrl('/Api/Annotation/Tags', JSON.stringify(tag), {})
      .toPromise()
      .then(
        (response: Response) => {
          let newId = response.json().value as number;
          let localTags = this.tagCache.getValue();

          tag.id = newId;
          localTags.push(tag);
          localTags.sort(Tag.tagAlphaCompare);
          this.tagCache.next(localTags);

          return newId;
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Checks if current user is permitted to create new tags.
   * @returns Promise<boolean> true if current user is allowed to create tags, false otherwise
   */
  currentUserCanCreateTags(): Promise<boolean> {
    return this.cmsApiService.getUrl('/Api/Permissions/Annotation/Tags/All/Permission/IsAllowedToCreate', {})
      .toPromise()
      .then(
        (response: Response) => response.status === 200
      ).catch(
        (response: any) => (response.status === 401 || response.status === 403) ? false : this.handleError(response)
      );
  }

  /**
   * Checks if current user is permitted to edit or delete existing tags.
   * @returns Promise<boolean> true if current user is allowed to edit/delete tags, false otherwise
   */
  currentUserCanEditTags(): Promise<boolean> {
    return this.cmsApiService.getUrl('/Api/Permissions/Annotation/Tags/All/Permission/IsAllowedToEdit', {})
      .toPromise()
      .then(
        (response: Response) => response.status === 200
      ).catch(
        (response: any) => (response.status === 401 || response.status === 403) ? false : this.handleError(response)
      );
  }

  /**
   * Deletes a tag with the specified id.
   * @param id id of the tag to delete.
   * @returns {Promise<Response>} Server's response.
   */
  deleteTag(id: number): Promise<Response> {
    return this.cmsApiService.deleteUrl('/Api/Annotation/Tags/' + id, {})
      .toPromise()
      .then(
        (response: Response) => {
          // TODO: also delete the tag subtree!
          let localTags = this.tagCache.getValue();
          let deleteIndex = localTags.findIndex(tag => tag.id === id);

          if (localTags[deleteIndex].isSubtag()) {
            let parentTag = localTags.find(tag => tag.id === localTags[deleteIndex].parentId);
            parentTag.childId.splice(parentTag.childId.indexOf(id), 1);
          }

          localTags.splice(deleteIndex, 1);
          this.tagCache.next(localTags);

          return response;
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Get all tags from the server, bypassing the local tag cache.
   * @returns {Promise<Tag[]>} Array of all tags.
   */
  getAllTags(onlyRoot = false, includeDeleted = false): Promise<Tag[]> {
    return this.cmsApiService.getUrl('/Api/Annotation/Tags?IncludeOnlyRoot=' + onlyRoot +
      '&IncludeDeleted=' + includeDeleted, {})
      .toPromise()
      .then(
        (response: Response) => Tag.extractTagArray(response).sort(Tag.tagAlphaCompare)
      ).then(
        (allTags: Tag[]) => this.enhanceTags(allTags)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Get child tags of a specific tag.
   * @param id id of the parent tag.
   * @returns {Promise<Tag[]>} Array of child tags.
   */
  getChildTags(id: number): Promise<Tag[]> {
    return this.cmsApiService.getUrl(`/Api/Annotation/Tags/${id}/ChildTags`, {})
      .toPromise()
      .then(
        (response: Response) => Tag.extractTagArray(response).sort(Tag.tagAlphaCompare)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /** Returns an array of requested tags from the local tag cache. */
  getFromCache(ids: number[]): Tag[] {
    return this.tagCache.getValue().filter(tag => ids.includes(tag.id));
  }

  /**
   * Get a specific tag by its id.
   * @param id id of the tag.
   * @returns {Tag} The tag.
   */
  getTag(id: number): Promise<Tag> {
    return this.cmsApiService.getUrl('/Api/Annotation/Tags/' + id, {})
      .toPromise()
      .then(
        (response: Response) => Tag.extractTag(response)
      ).then(
        (tag: Tag) => this.enhanceTags([tag])
      ).then(
        (enhancedTags: Tag[]) => enhancedTags[0]
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Set one tag as the child of another tag.
   * @param parentId id of the parent tag.
   * @param childId id of the tag to be set as a child.
   * @returns {Promise<Response>} Server's response.
   */
  setChildTag(parentId: number, childId: number): Promise<Response> {
    return this.cmsApiService.postUrl(`/Api/Annotation/Tags/${parentId}/ChildTags/${childId}`, '', {})
      .toPromise()
      .then(
        (response: Response) => {
          let localTags = this.tagCache.getValue();
          localTags.find(tag => tag.id === parentId).childId.push(childId);
          localTags.find(tag => tag.id === childId).parentId = parentId;
          this.tagCache.next(localTags);

          return response;
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Remove parent-child association between two tags.
   * @param parentId id of the parent tag.
   * @param childId id of the child tag.
   * @returns {Promise<Response>} Server's response.
   */
  unsetChildTag(parentId: number, childId: number): Promise<Response> {
    return this.cmsApiService.deleteUrl(`/Api/Annotation/Tags/${parentId}/ChildTags/${childId}`, {})
      .toPromise()
      .then(
        (response: Response) => {
          let localTags = this.tagCache.getValue();
          let parentTag = localTags.find(tag => tag.id === parentId);
          parentTag.childId.splice(parentTag.childId.indexOf(childId), 1);
          localTags.find(tag => tag.id === childId).parentId = undefined;
          this.tagCache.next(localTags);

          return response;
        }
      )
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Overwrites a given tag with supplied data.
   * @param tag The tag to update.
   * @returns {Promise<Response>} Server's response.
   */
  updateTag(tag: Tag): Promise<Response> {
    return this.cmsApiService.putUrl('/Api/Annotation/Tags/' + tag.id, JSON.stringify(tag), {})
      .toPromise()
      .then(
        (response: Response) => {
          let localTags = this.tagCache.getValue();
          let tagToUpdate = localTags.find(item => item.id === tag.id);

          for (let prop in tagToUpdate) {
            if (tagToUpdate.hasOwnProperty(prop)) {
              tagToUpdate[prop] = tag[prop];
            }
          }
          this.tagCache.next(localTags);

          return response;
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Fetches and returns the HTML content to annotate.
   * @param topicId The id of the topic to get the HTML content from
   * @returns {Promise<string>} A string which represents a HTML document.
   */
  public getAnnotateContent(topicId: number) {
    return this.cmsApiService.getUrl(`/Api/Topics/${topicId}/Document`, {})
      .toPromise()
      .then((response: any) => {
        return response.json();
      })
      .catch((error: any) => {
        if (error.status === 404) { // no Document uploaded to CMS API
          return this.ooApiService.getUrl(`/topic/${topicId}/html`, {})
            .toPromise()
            .then((response: any) => { return { content: response._body } })
            .catch(this.handleError);
        }
      });
  }

  public saveAnnotatedDocument(topicId: number, htmlContent: string) {
    return this.cmsApiService.postUrl(`/Api/Topics/${topicId}/Document`,
      JSON.stringify({ htmlContent: htmlContent }), {})
      .toPromise()
      .catch(this.handleError);
  }


  /** Sets childId and parentId for all tags in the supplied array. */
  private enhanceTags(tags: Tag[]) {
    return Promise.all(tags.map(tag => this.getChildTags(tag.id)))
      .then(
        (response: Tag[][]) => {
          for (let i = 0; i < response.length; i++) {
            tags[i].childId = response[i].sort(Tag.tagAlphaCompare).map(tag => tag.id);

            for (let childTag of tags.filter(tag => tags[i].childId.includes(tag.id))) {
              childTag.parentId = tags[i].id;
            }
          }
          return tags;
        }
      );
  }

  private handleError(error: any) {
    let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Promise.reject(errMsg);
  }
}
