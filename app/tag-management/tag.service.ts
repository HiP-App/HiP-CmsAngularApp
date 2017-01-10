import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { TranslateService } from 'ng2-translate';

import { CmsApiService } from '../core/api/cms-api.service';
import { Tag } from './tag.model';

/**
 * Service for making tag-related API calls to the HiPCMS Web API.
 * Manages creation, deletion, retrieval, updating, etc. of tags.
 */
@Injectable()
export class TagService {

  constructor(private cmsApiService: CmsApiService,
              private translateService: TranslateService) {}

   /**
   * Creates a new tag.
   * @returns {Promise<Response>} Server's response.
   */
  createTag(tag: Tag): Promise<Response> {
    return this.cmsApiService.postUrl('/Api/Annotation/Tags', tag.formData(), {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Checks if current user is permitted to create new tags.
   * 
   * @returns Promise<boolean> true if current user is allowed to create tags, false otherwise
   */
  currentUserCanCreateTags(): Promise<boolean> {
    return this.cmsApiService.getUrl('/Api/Permissions/Annotation/Tags/All/Permission/IsAllowedToCreate', {})
      .toPromise()
      .then(
        (response: any) => response.status === 200
      ).catch(
        (response: any) => (response.status === 401 || response.status === 403) ? false : this.handleError(response)
      );
  }

  /**
   * Checks if current user is permitted to edit or delete existing tags.
   * 
   * @returns Promise<boolean> true if current user is allowed to edit/delete tags, false otherwise
   */
  currentUserCanEditTags(): Promise<boolean> {
    return this.cmsApiService.getUrl('/Api/Permissions/Annotation/Tags/All/Permission/IsAllowedToEdit', {})
      .toPromise()
      .then(
        (response: any) => response.status === 200
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
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Get all currently stored tags.
   * @returns {Promise<Tag[]>} Array of all tags.
   */
  getAllTags(): Promise<Tag[]> {
    return this.cmsApiService.getUrl('/Api/Annotation/Tags', {})
      .toPromise()
      .then(
        (response: any) => Tag.extractTagArray(response).sort(this.tagAlphaCompare)
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
        (response: any) => Tag.extractTagArray(response).sort(this.tagAlphaCompare)
      ).catch(
        (error: any) => this.handleError(error)
      );
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
        (response: any) => Tag.extractTag(response)
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
      .catch(
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
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  private handleError(error: any) {
    let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Promise.reject(errMsg);
  }

  /**
   * Utility function to sort tags alphabetically.
   * Lambda syntax is required for proper binding of 'this'.
   */
  private tagAlphaCompare = (a: Tag, b: Tag) => {
    return a.name.localeCompare(b.name, this.translateService.currentLang, { numeric: true });
  }
}
