import { Injectable } from '@angular/core';

import { CmsApiService } from '../../core/api/cms-api.service';
import { Topic } from './topic.model';
import { User } from '../../core/user/user.model';

/**
 * Service which does topic related api calls and returns them as Promise <br />
 * Here is an example how to use it to get a topic. <br />
 * <code>
 * this.topicService.getTopic(2).then(<br />
 * data => this.topic = <Topic> data,<br />
 * ).catch(<br />
 * error => this.handleError(error)<br />
 * );
 * </code>
 */
@Injectable()
export class TopicService {

  constructor(private cmsApiService: CmsApiService) {}

  // GET

  /**
   * Gets a Topic by Id.
   * @param id The Id of the Topic you want to get
   * @returns {Promise<Topic>} a Promise for a Topic object
   */
  public getTopic(id: number) {
    return this.cmsApiService.getUrl('/api/Topics/' + id, {})
      .toPromise()
      .then(
        (response: any) => Topic.extractData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Shorthand method to find topics, with a query
   * @param query
   * @param page
   * @returns {Promise<Topic>} a Promise for a Topic object
   */
  public findTopic(query: string, page = 1) {
    return this.getAllTopics(page, false, query);
  }

  /**
   * Shorthand method to finds topics with deadline
   * @param deadline The deadline to query for
   * @param page for pagination
   * @returns {Promise<Topic[]>}
   */
  public findTopicWithDeadline(deadline: string, page = 1) {
    return this.getAllTopics(page, false, '', deadline);
  }

  /**
   * Shorthand method to find topics with status
   * @param status The status to query for
   * @param page for pagination
   * @returns {Promise<Topic[]>}
   */
  public findTopicWithStatus(status: string, page = 1) {
    return this.getAllTopics(page, false, '', '', status);
  }

  /**
   * Shorthand method to get all topics, which are not child from any topic.
   * @returns {Promise<Topic[]>}
   */
  public getAllParentTopics(page = 1) {
    return this.getAllTopics(page, true);
  }

  /**
   * Get all topics, saved on the Server
   * @param page The page number for pagination
   * @param onlyParents boolean for getting only parent topics
   * @param query String for querying the topics, for searching for title or similar
   * @param deadline a status to query for
   * @param status a status to query for
   * @returns {Promise<Topic[]>} a Promise for a Topic object Array
   */
  public getAllTopics(page = 1, onlyParents = false, query = '', deadline = '', status = '') {
    return this.cmsApiService.getUrl('/api/Topics?page=' +
      page + '&onlyParents=' + onlyParents + '&query=' + query +
      '&deadline=' + deadline + '&status=' + status, {})
      .toPromise()
      .then(
        (response: any) => Topic.extractPaginationedArrayData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Gets all topics associated to current user
   * @returns {Promise<Topic[]>} a Promise for a Topic[] object
   */
  public getAllTopicsOfCurrentUser() {
    return this.cmsApiService.getUrl('/Api/Topics/OfUser/Current', {})
      .toPromise()
      .then(
        (response: any) => Topic.extractPaginationedArrayData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Gets the students assigned to a specific topic
   * @param id The id of the topic
   * @returns {Promise<User[]>} all Students assigned to the topic
   */
  public getStudentsOfTopic(id: number) {
    return this.getUsersOfTopic(id, 'Students');
  }

  /**
   * Gets the Supervisors assigned to a specific topic
   * @param id The id of the topic
   * @returns {Promise<User[]>} all Supervisors assigned to the topic
   */
  public getSupervisorsOfTopic(id: number) {
    return this.getUsersOfTopic(id, 'Supervisors');
  }

  /**
   * Gets the Reviewers assigned to a specific topic
   * @param id The id of the topic
   * @returns {Promise<User[]>} all Reviewer assigned to the topic
   */
  public getReviewersOfTopic(id: number) {
    return this.getUsersOfTopic(id, 'Reviewers');
  }

  /**
   * Gets all parent Topics of a specific topic
   * @param id The id of the topic
   * @returns {Promise<Topic[]>} all Parent topics of the topic
   */
  public getParentTopics(id: number) {
    return this.getTopicsOfTopic(id, 'ParentTopics');
  }

  /**
   * Gets all child Topics of a specific topic
   * @param id The id of the topic
   * @returns {Promise<Topic[]>} all child topics of the topic
   */
  public getSubTopics(id: number) {
    return this.cmsApiService.getUrl('/api/Topics/' + id + '/' + 'SubTopics' + '/', {})
      .toPromise()
      .then(
        (response: any) => Topic.extractSubTopicsArrayData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  // GET Permissions

  /**
   * Checks if current user is allowed to edit contents of a topic.
   * @param id id of the topic
   * @returns {Promise<boolean>} true if current user is allowed to edit contents, false otherwise
   */
  public currentUserCanEditTopicContent(id: number): Promise<boolean> {
    return this.cmsApiService.getUrl(`/Api/Permissions/Topics/${id}/Permission/IsAssociatedTo`, {})
      .toPromise()
      .then(
        (response: any) => response.status === 200
      ).catch(
        (response: any) => (response.status === 401 || response.status === 403) ? false : this.handleError(response)
      );
  }

  /**
   * Checks if current user is allowed to edit details of a topic.
   * @param id id of the topic
   * @returns {Promise<boolean>} true if current user is allowed to edit details, false otherwise
   */
  public currentUserCanEditTopicDetails(id: number): Promise<boolean> {
    return this.cmsApiService.getUrl(`/Api/Permissions/Topics/${id}/Permission/IsAllowedToEdit`, {})
      .toPromise()
      .then(
        (response: any) => response.status === 200
      ).catch(
        (response: any) => (response.status === 401 || response.status === 403) ? false : this.handleError(response)
      );
  }

  // POST

  /**
   * Creates a Topic on the backend
   * @param topic The topic you want to save
   * @returns {Promise<Topic>} a Promise for a Topic object
   */
  public createTopic(topic: Topic) {
    let data = topic.formData();
    return this.cmsApiService.postUrl('/api/Topics', data, {})
      .toPromise()
      .then(
        (response: any) => {
          return response.json();
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  // PUT

  /**
   * Updates a given Topic
   * @param topic The topic you want to update
   * @returns {Promise<Topic>} a Promise for a Topic object
   */
  public updateTopic(topic: Topic) {
    let data = topic.formData();
    return this.cmsApiService.putUrl('/api/Topics/' + topic.id, data, {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * Updates a given Status
   * @param id The Id of the Topic, Status of the topic
   * @param status the status to change to
   */
  public saveStatusofTopic(id: number, status: string) {
    let data = '';
    data += 'Status=' + status;
    return this.cmsApiService.putUrl('/api/Topics/' + id + '/Status', data, {})
      .toPromise()
      .then()
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * adds a subtopic to a given parent topic id
   * @param parentId Id of the parent topic
   * @param subtopicId Id of the subtopic
   */
  public addSubtopicToTopic(parentId: number, subtopicId: number) {
    return this.cmsApiService.putUrl('/api/Topics/' + parentId + '/' + 'SubTopics' + '/' + subtopicId + '/', '', {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * updates the students of a topic
   * @param id id of the topic
   * @param data Array of userids to update
   * @returns {Promise}
   */
  public putStudentsOfTopic(id: number, data: number[]) {
    return this.putUsersOfTopic(id, 'users=' + data.join('&users='), 'Students');
  }

  /**
   * updates the supervisors of a topic
   * @param id id of the topic
   * @param data Array of userids to update
   * @returns {Promise}
   */
  public putSupervisorsOfTopic(id: number, data: number[]) {
    return this.putUsersOfTopic(id, 'users=' + data.join('&users='), 'Supervisors');
  }

  /**
   * updates the reviewers of a topic
   * @param id id of the topic
   * @param data Array of userids to update
   * @returns {Promise}
   */
  public putReviewersOfTopic(id: number, data: number[]) {
    return this.putUsersOfTopic(id, 'users=' + data.join('&users='), 'Reviewers');
  }

  // DELETE

  /**
   * deletes a Topic, identified by an id
   * @param id Id of the topic you want to be deleted
   * @returns {Promise<Response>} a Promise for the server response
   */
  public deleteTopic(id: number) {
    return this.cmsApiService.deleteUrl('/api/Topics/' + id, {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  /**
   * removes subtopic from parent topic
   * @param parentId Id of parent topic
   * @param subtopicId Id of Subtopic
   * @returns {Promise<Response>}
   */
  public deleteSubtopic(parentId: number, subtopicId: number) {
    return this.cmsApiService.deleteUrl('/api/Topics/' + parentId + '/' + 'SubTopics' + '/' + subtopicId + '/', {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  // private methods

  private getTopicsOfTopic(id: number, associated: string) {
    return this.cmsApiService.getUrl('/api/Topics/' + id + '/' + associated + '/', {})
      .toPromise()
      .then(
        (response: any) => Topic.extractArrayData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  private getUsersOfTopic(id: number, role: string) {
    return this.cmsApiService.getUrl('/api/Topics/' + id + '/' + role + '/', {})
      .toPromise()
      .then(
        (response: any) => User.extractArrayData(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  private putUsersOfTopic(id: number, data: string, role: string) {
    return this.cmsApiService.putUrl('/api/Topics/' + id + '/' + role + '/', data, {})
      .toPromise()
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(error);
    return Promise.reject(errMsg);
  }
}
