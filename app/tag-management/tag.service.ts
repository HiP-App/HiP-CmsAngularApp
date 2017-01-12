import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { CmsApiService } from '../core/api/cms-api.service';
import { Tag } from './tag.model';

/**
 * Service for making tag-related API calls to the HiPCMS Web API.
 * Manages creation, deletion, retrieval, updating, etc. of tags.
 */
@Injectable()
export class TagService {

  constructor(private cmsApiService: CmsApiService) {}

   /**
   * Creates a new tag.
   * 
   * @returns {Promise<number>} id of the created tag.
   */
  createTag(tag: Tag): Promise<number> {
    return this.cmsApiService.postUrl('/Api/Annotation/Tags', tag.formData(), {})
      .toPromise()
      .then(
        (response: Response) => response.json().value
      ).catch(
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
        (response: any) => Tag.extractTagArray(response).sort(Tag.tagAlphaCompare)
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
        (response: any) => Tag.extractTagArray(response).sort(Tag.tagAlphaCompare)
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

  /**
   * fetches and returns the Html Content to Annotate.
   * TODO: For the moment it returns a static Lorem Ipsum text.
   * TODO Should fetch the data from the server as soon as it's implemnted there
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
    mollis suspendisse.</p>`
      );
    });
  }

  private handleError(error: any) {
    let errMsg = error.message || error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Promise.reject(errMsg);
  }
}
