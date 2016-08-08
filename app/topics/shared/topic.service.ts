import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Topic } from './topic.model';
import { CmsApiService } from '../../shared/api/cms-api.service';
import { User } from '../../shared/user/user.model';

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
      .then(response => Topic.extractData(response))
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
      .then(response => Topic.extractData(response))
      .catch(this.handleError);
  }

  /**
   * Find a topic, with a query (not yet implemented on server side)
   * @param query
   * @returns {Promise<Topic>} a Promise for a Topic object
   */
  public findTopic(query: string) {
    return this.cmsApiService.getUrl('/api/Topics/' + query, {})
      .toPromise()
      .then(response => Topic.extractData(response))
      .catch(this.handleError);
  }

  /**
   * Get all topics, saved on the Server
   * @returns {Promise<Topic[]>} a Promise for a Topic object Array
   */
  public getAllTopics() {
    return this.cmsApiService.getUrl('/api/Topics', {})
      .toPromise()
      .then(
        response => Topic.extractArrayData(response)
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
      .then(response => Topic.extractData(response))
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
   * @returns {Promise<TResult>} all Parent topics of the topic
   */
  public getParentTopics(id: number) {
    return this.getTopicsOfTopic(id, 'ParentTopics');
  }

  /**
   * Gets all child Topics of a specific topic
   * @param id The id of the topic
   * @returns {Promise<TResult>} all child topics of the topic
   */
  public getSubTopics(id: number) {
    return this.getTopicsOfTopic(id, 'SubTopics');
  }

  private getUsersOfTopic(id: number, role: string) {
    return this.cmsApiService.getUrl('/api/Topics/' + id + '/' + role, {})
      .toPromise()
      .then(
        response => User.extractArrayData(response)
      ).catch(this.handleError);
  }

  private getTopicsOfTopic(id: number, associated: string) {
    return this.cmsApiService.getUrl('/api/Topics/' + id + '/' + associated, {})
      .toPromise()
      .then(
        response => Topic.extractArrayData(response)
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
