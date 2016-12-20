import { Injectable } from '@angular/core';

import { CmsApiService } from '../core/api/cms-api.service';
import { Tag } from './tag.model';

/**
 * Service for making tag-related API calls to the HiPCMS Web API.
 * Manages creation, deletion, retrieval, updating, etc. of tags.
 */
@Injectable()
export class TagService {

  constructor(private cmsApiService: CmsApiService) {
  }

   /**
   * Creates a new tag.
   * @returns {Promise<Response>} Server's response.
   */
  public createTag(tag: Tag) {
    return this.cmsApiService.postUrl('/Api/Annotation/Tags', tag.formData(), {})
      .toPromise()
      .catch(this.handleError);
  }

  /**
   * Checks if current user is permitted to create new tags.
   * 
   * @returns Promise<boolean> true if current user is allowed to create tags, false otherwise
   */
  public currentUserCanCreateTags(): Promise<boolean> {
    return this.cmsApiService.getUrl('/Api/Permissions/Annotation/Tags/All/Permission/IsAllowedToCreate', {})
      .toPromise()
      .then(response => response.status === 200)
      .catch(response => (response.status === 401 || response.status === 403) ? false : this.handleError(response));
  }

  /**
   * Checks if current user is permitted to edit or delete existing tags.
   * 
   * @returns Promise<boolean> true if current user is allowed to edit/delete tags, false otherwise
   */
  public currentUserCanEditTags(): Promise<boolean> {
    return this.cmsApiService.getUrl('/Api/Permissions/Annotation/Tags/All/Permission/IsAllowedToEdit', {})
      .toPromise()
      .then(response => response.status === 200)
      .catch(response => (response.status === 401 || response.status === 403) ? false : this.handleError(response));
  }

  /**
   * Deletes a tag with the specified id.
   * @param id id of the tag to delete.
   * @returns {Promise<Response>} Server's response.
   */
  public deleteTag(id: number) {
    return this.cmsApiService.deleteUrl('/Api/Annotation/Tags/' + id, {})
      .toPromise()
      .catch(this.handleError);
  }

  /**
   * Get all currently stored tags.
   * @returns {Promise<Tag[]>} Array of all tags.
   */
  public getAllTags(): Promise<Tag[]> {
    return this.cmsApiService.getUrl('/Api/Annotation/Tags', {})
      .toPromise()
      .then(Tag.extractTagArray)
      .catch(this.handleError);
  }

  /**
   * Get child tags of a specific tag.
   * @param id id of the parent tag.
   * @returns {Promise<Tag[]>} Array of child tags.
   */
  public getChildTags(id: number): Promise<Tag[]> {
    return this.cmsApiService.getUrl(`/Api/Annotation/Tags/${id}/ChildTags`, {})
      .toPromise()
      .then(Tag.extractTagArray)
      .catch(this.handleError);
  }

  /**
   * Get a specific tag by its id.
   * @param id id of the tag.
   * @returns {Tag} The tag.
   */
  public getTag(id: number): Promise<Tag> {
    return this.cmsApiService.getUrl('/Api/Annotation/Tags/' + id, {})
      .toPromise()
      .then(Tag.extractTag)
      .catch(this.handleError);
  }

  /**
   * Set one tag as the child of another tag.
   * @param parentId id of the parent tag.
   * @param childId id of the tag to be set as a child.
   * @returns {Promise<Response>} Server's response.
   */
   public setChildTag(parentId: number, childId: number) {
    return this.cmsApiService.postUrl(`/Api/Annotation/Tags/${parentId}/ChildTags/${childId}`, '', {})
      .toPromise()
      .catch(this.handleError);
  }

  /**
   * Remove parent-child association between two tags.
   * @param parentId id of the parent tag.
   * @param childId id of the child tag.
   * @returns {Promise<Response>} Server's response.
   */
  public unsetChildTag(parentId: number, childId: number) {
    return this.cmsApiService.deleteUrl(`/Api/Annotation/Tags/${parentId}/ChildTags/${childId}`, {})
      .toPromise()
      .catch(this.handleError);
  }

  /**
   * Overwrites a given tag with supplied data.
   * @param tag The tag to update.
   * @returns {Promise<Response>} Server's response.
   */
  public updateTag(tag: Tag) {
    return this.cmsApiService.putUrl('/Api/Annotation/Tags/' + tag.id, tag.formData(), {})
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Promise.reject(errMsg);
  }
}
