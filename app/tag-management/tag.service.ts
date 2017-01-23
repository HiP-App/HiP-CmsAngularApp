import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';

import { CmsApiService } from '../core/api/cms-api.service';
import { Tag } from './tag.model';

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

  constructor(private cmsApiService: CmsApiService) {
    this.getAllTags()
      .then(tags => this.tagCache.next(tags))
      .catch(error => this.tagCache.error(error));
  }

  /**
   * Creates a new tag.
   * @returns {Promise<number>} id of the created tag.
   */
  createTag(tag: Tag): Promise<number> {
    return this.cmsApiService.postUrl('/Api/Annotation/Tags', tag.formData(), {})
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
  getAllTags(): Promise<Tag[]> {
    return this.cmsApiService.getUrl('/Api/Annotation/Tags', {})
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
    return this.cmsApiService.putUrl('/Api/Annotation/Tags/' + tag.id, tag.formData(), {})
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
   * TODO: For the moment it returns a static Lorem Ipsum text.
   * TODO: Should fetch the data from the server as soon as it's implemnted there
   * @param topicId The id of the topic to get the HTML content from
   * @returns {Promise<string>} A string which represents a HTML document.
   */
  public getAnnotateContent(topicId: number) {
    return new Promise((resolve) => {
      resolve(`
    <h2>Lorem ipsum</h2>
    <p>
      Lorem ipsum dolor sit amet, nulla ante enim pulvinar, eget erat eget in nulla iaculis, in leo vestibulum tenetur 
      ante vitae aliquam, tortor ante leo interdum, congue officia etiam molestie metus omnis. At est vel, unde tempor, 
      interdum ut orci metus vel morbi lorem. Et arcu sed suspendisse. Vel maecenas tincidunt justo eget mi, sed id, 
      wisi urna sit egestas fringilla, at erat. Dolor nunc. 
      <span data-tag-model-id="56" data-tag-id="13">Vestibulum</span> luctus aenean a, quam lobortis praesent, faucibus 
      penatibus elementum, ultrices nullam amet dolor. Lectus luctus nullam volutpat ante aliquam massa, blandit dolor 
      magna ornare nullam habitant, lacus felis eu ultrices condimentum suspendisse vel. Et erat ac, 
      <span data-tag-model-id="60" data-tag-id="24" data-tag-related-to="20">sit</span> ac, justo ac natoque in 
      ullamcorper, vel pellentesque consectetuer augue imperdiet duis nonummy, donec nunc erat maecenas elementum.</p>
    <p>
      Ultricies auctor, tincidunt 
      <span data-tag-model-id="60" data-tag-id="20" data-tag-related-to="24">dignissim</span> cursus lorem, 
      mauris et, quis tellus ut sed. Maecenas mauris congue, aliquet arcu at quis vestibulum. 
      Justo eget libero suspendisse dolor est, dictum mi eu, neque diam ligula turpis, feugiat morbi vel ac, porta 
      pellentesque accumsan sit ligula quam. Dolor velit, donec malesuada urna pulvinar dolor, vestibulum id pharetra 
      sapien dui, a nullam lectus lorem. Etiam malesuada id erat. Vivamus cursus tempor non congue, sed sed fusce 
      libero neque laboris, nisl sed tristique, ac vestibulum quis cursus per etiam nulla. Tortor aliquam, wisi aenean, 
      vulputate elit non interdum est ullamcorper est, rutrum id tristique fames aptent malesuada, eget dui magnis 
      purus est id. Magnis etiam torquent cursus et sagittis, inventore eu elit ipsum fringilla quis, morbi id 
      consectetuer, ut nunc porttitor justo purus sodales in. Tellus omnis commodo sem. Leo fusce libero natoque est 
      at, wisi est lectus magna eget convallis.</p>
    <p>
    Voluptas dapibus, velit cras amet, faucibus in etiam tellus faucibus odio. Vitae donec venenatis, pellentesque 
    justo at nulla. Erat faucibus, volutpat gravida dolor. Lacus scelerisque mattis suspendisse nulla sed vel, laoreet 
    sed nibh urna, erat tempus pellentesque. Lorem nibh per et hymenaeos orci, arcu vulputate massa fusce, pellentesque 
    hendrerit leo vitae nec, fringilla aliquam fusce a pede sagittis erat, euismod maecenas eros tellus. Sagittis 
    egestas donec ullamcorper sem nec quisque, ultricies libero pulvinar nec donec, placerat sed ridiculus tortor 
    pellentesque elit proin, consectetuer ac.</p>
    <p>
    Augue aenean ipsum ante, porta interdum, sapien dui vestibulum felis molestie morbi. Tortor etiam arcu sodales, 
    id quam, aliquet condimentum, ac duis pede dolor vestibulum amet. Volutpat eius, vestibulum amet elit, vitae 
    maecenas arcu aliquet. Justo vehicula. Morbi bibendum tincidunt elit interdum adipiscing, turpis facilisis libero 
    adipiscing neque magna ut, eu id suscipit ac gravida, curabitur porttitor, curabitur cursus est at. Nunc eu conubia 
    morbi itaque non, egestas scelerisque euismod, imperdiet viverra magna. In pellentesque, condimentum dui sit 
    mollis suspendisse.</p>
<p>
    Voluptas dapibus, velit cras amet, faucibus in etiam tellus faucibus odio. Vitae donec venenatis, pellentesque 
    justo at nulla. Erat faucibus, volutpat gravida dolor. Lacus scelerisque mattis suspendisse nulla sed vel, laoreet 
    sed nibh urna, erat tempus pellentesque. Lorem nibh per et hymenaeos orci, arcu vulputate massa fusce, pellentesque 
    hendrerit leo vitae nec, fringilla aliquam fusce a pede sagittis erat, euismod maecenas eros tellus. Sagittis 
    egestas donec ullamcorper sem nec quisque, ultricies libero pulvinar nec donec, placerat sed ridiculus tortor 
    pellentesque elit proin, consectetuer ac.</p>
    <p>
    Augue aenean ipsum ante, porta interdum, sapien dui vestibulum felis molestie morbi. Tortor etiam arcu sodales, 
    id quam, aliquet condimentum, ac duis pede dolor vestibulum amet. Volutpat eius, vestibulum amet elit, vitae 
    maecenas arcu aliquet. Justo vehicula. Morbi bibendum tincidunt elit interdum adipiscing, turpis facilisis libero 
    adipiscing neque magna ut, eu id suscipit ac gravida, curabitur porttitor, curabitur cursus est at. Nunc eu conubia 
    morbi itaque non, egestas scelerisque euismod, imperdiet viverra magna. In pellentesque, condimentum dui sit 
    mollis suspendisse.</p>
<p>
    Voluptas dapibus, velit cras amet, faucibus in etiam tellus faucibus odio. Vitae donec venenatis, pellentesque 
    justo at nulla. Erat faucibus, volutpat gravida dolor. Lacus scelerisque mattis suspendisse nulla sed vel, laoreet 
    sed nibh urna, erat tempus pellentesque. Lorem nibh per et hymenaeos orci, arcu vulputate massa fusce, pellentesque 
    hendrerit leo vitae nec, fringilla aliquam fusce a pede sagittis erat, euismod maecenas eros tellus. Sagittis 
    egestas donec ullamcorper sem nec quisque, ultricies libero pulvinar nec donec, placerat sed ridiculus tortor 
    pellentesque elit proin, consectetuer ac.</p>
    <p>
    Augue aenean ipsum ante, porta interdum, sapien dui vestibulum felis molestie morbi. Tortor etiam arcu sodales, 
    id quam, aliquet condimentum, ac duis pede dolor vestibulum amet. Volutpat eius, vestibulum amet elit, vitae 
    maecenas arcu aliquet. Justo vehicula. Morbi bibendum tincidunt elit interdum adipiscing, turpis facilisis libero 
    adipiscing neque magna ut, eu id suscipit ac gravida, curabitur porttitor, curabitur cursus est at. Nunc eu conubia 
    morbi itaque non, egestas scelerisque euismod, imperdiet viverra magna. In pellentesque, condimentum dui sit 
    mollis suspendisse.</p>
<p>
    Voluptas dapibus, velit cras amet, faucibus in etiam tellus faucibus odio. Vitae donec venenatis, pellentesque 
    justo at nulla. Erat faucibus, volutpat gravida dolor. Lacus scelerisque mattis suspendisse nulla sed vel, laoreet 
    sed nibh urna, erat tempus pellentesque. Lorem nibh per et hymenaeos orci, arcu vulputate massa fusce, pellentesque 
    hendrerit leo vitae nec, fringilla aliquam fusce a pede sagittis erat, euismod maecenas eros tellus. Sagittis 
    egestas donec ullamcorper sem nec quisque, ultricies libero pulvinar nec donec, placerat sed ridiculus tortor 
    pellentesque elit proin, consectetuer ac.</p>
    <p>
    Augue aenean ipsum ante, porta interdum, sapien dui vestibulum felis molestie morbi. Tortor etiam arcu sodales, 
    id quam, aliquet condimentum, ac duis pede dolor vestibulum amet. Volutpat eius, vestibulum amet elit, vitae 
    maecenas arcu aliquet. Justo vehicula. Morbi bibendum tincidunt elit interdum adipiscing, turpis facilisis libero 
    adipiscing neque magna ut, eu id suscipit ac gravida, curabitur porttitor, curabitur cursus est at. Nunc eu conubia 
    morbi itaque non, egestas scelerisque euismod, imperdiet viverra magna. In pellentesque, condimentum dui sit 
    mollis suspendisse.</p>
<p>
    Voluptas dapibus, velit cras amet, faucibus in etiam tellus faucibus odio. Vitae donec venenatis, pellentesque 
    justo at nulla. Erat faucibus, volutpat gravida dolor. Lacus scelerisque mattis suspendisse nulla sed vel, laoreet 
    sed nibh urna, erat tempus pellentesque. Lorem nibh per et hymenaeos orci, arcu vulputate massa fusce, pellentesque 
    hendrerit leo vitae nec, fringilla aliquam fusce a pede sagittis erat, euismod maecenas eros tellus. Sagittis 
    egestas donec ullamcorper sem nec quisque, ultricies libero pulvinar nec donec, placerat sed ridiculus tortor 
    pellentesque elit proin, consectetuer ac.</p>
    <p>
    Augue aenean ipsum ante, porta interdum, sapien dui vestibulum felis molestie morbi. Tortor etiam arcu sodales, 
    id quam, aliquet condimentum, ac duis pede dolor vestibulum amet. Volutpat eius, vestibulum amet elit, vitae 
    maecenas arcu aliquet. Justo vehicula. Morbi bibendum tincidunt elit interdum adipiscing, turpis facilisis libero 
    adipiscing neque magna ut, eu id suscipit ac gravida, curabitur porttitor, curabitur cursus est at. Nunc eu conubia 
    morbi itaque non, egestas scelerisque euismod, imperdiet viverra magna. In pellentesque, condimentum dui sit 
    mollis suspendisse.</p>
<p>
    Voluptas dapibus, velit cras amet, faucibus in etiam tellus faucibus odio. Vitae donec venenatis, pellentesque 
    justo at nulla. Erat faucibus, volutpat gravida dolor. Lacus scelerisque mattis suspendisse nulla sed vel, laoreet 
    sed nibh urna, erat tempus pellentesque. Lorem nibh per et hymenaeos orci, arcu vulputate massa fusce, pellentesque 
    hendrerit leo vitae nec, fringilla aliquam fusce a pede sagittis erat, euismod maecenas eros tellus. Sagittis 
    egestas donec ullamcorper sem nec quisque, ultricies libero pulvinar nec donec, placerat sed ridiculus tortor 
    pellentesque elit proin, consectetuer ac.</p>
    <p>
    Augue aenean ipsum ante, porta interdum, sapien dui vestibulum felis molestie morbi. Tortor etiam arcu sodales, 
    id quam, aliquet condimentum, ac duis pede dolor vestibulum amet. Volutpat eius, vestibulum amet elit, vitae 
    maecenas arcu aliquet. Justo vehicula. Morbi bibendum tincidunt elit interdum adipiscing, turpis facilisis libero 
    adipiscing neque magna ut, eu id suscipit ac gravida, curabitur porttitor, curabitur cursus est at. Nunc eu conubia 
    morbi itaque non, egestas scelerisque euismod, imperdiet viverra magna. In pellentesque, condimentum dui sit 
    mollis suspendisse.</p>`
      );
    });
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
