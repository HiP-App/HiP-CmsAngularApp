import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Topic } from './topic.model';
import { CmsApiService } from '../../core/api/cms-api.service';
import { User } from '../../core/user/user.model';

/**
 * Service which does topic related api calls and returns them as Promise <br />
 * Here is an example how to use it to get the current User. <br />
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

  constructor(private cmsApiService: CmsApiService) {
  }

  /**
   * Creates a Topic on the backend
   * @param topic The topic you want to save
   * @returns {Promise<Topic>} a Promise for a Topic object
   */
  public createTopic(topic: Topic) {
    let data = topic.formData();
    return this.cmsApiService.postUrl('/api/Topics', data, {})
      .toPromise()
      .then((response: any) => {
        let body = response.json();
        return body;
      })
      .catch(this.handleError);
  }

  /**
   * deletes a Topic, identified by an id
   * @param id Id of the topic you want to be deleted
   * @returns {Promise<boolean>} a Promise for a Topic object
   */
  public deleteTopic(id: number) {
    return this.cmsApiService.deleteUrl('/api/Topics/' + id, {})
      .toPromise()
      .then(this.extractBooleanData)
      .catch(this.handleError);
  }

  /**
   * Gets a Topic by Id.
   * @param id The Id of the Topic you want to get
   * @returns {Promise<Topic>} a Promise for a Topic object
   */
  public getTopic(id: number) {
    return this.cmsApiService.getUrl('/api/Topics/' + id, {})
      .toPromise()
      .then((response: any) => Topic.extractData(response))
      .catch(this.handleError);
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
      page + '&onlyParents=' + onlyParents + '&query' + query +
      '&deadline=' + deadline + '&status=' + status, {})
      .toPromise()
      .then(
        (response: any) => Topic.extractPaginationedArrayData(response)
      ).catch(this.handleError);
  }

  /**
   * Updates a given Topic
   * @param topic The topic you want to update
   * @returns {Promise<Topic>} a Promise for a Topic object
   */
  public updateTopic(topic: Topic) {
    let data = topic.formData();
    return this.cmsApiService.putUrl('/api/Topics/' + topic.id, data, {})
      .toPromise()
      .then((response: any) => Topic.extractData(response))
      .catch(this.handleError);
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
    //return this.getTopicsOfTopic(id, 'SubTopics');
    return this.cmsApiService.getUrl('/api/Topics/' + id + '/' + 'SubTopics' + '/', {})
      .toPromise()
      .then(
        (response: any) => Topic.extractSubTopicsArrayData(response)
      ).catch(this.handleError);
  }

  private getUsersOfTopic(id: number, role: string) {
    return this.cmsApiService.getUrl('/api/Topics/' + id + '/' + role + '/', {})
      .toPromise()
      .then(
        (response: any) => User.extractArrayData(response)
      ).catch(this.handleError);
  }

  private getTopicsOfTopic(id: number, associated: string) {
    return this.cmsApiService.getUrl('/api/Topics/' + id + '/' + associated + '/', {})
      .toPromise()
      .then(
        (response: any) => Topic.extractArrayData(response)
      ).catch(this.handleError);
  }


  private extractBooleanData(res: Response): boolean {
    let body = res.text();
    console.log(body);
    if (body === 'true') {
      return true;
    } else {
      throw new Error(body);
    }
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(error);
    return Promise.reject(errMsg);
  }
}
