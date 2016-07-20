import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';

import { Topic } from './topic.model';
import { CmsApiService } from '../../shared/api/cms-api.service';
import { User } from '../../shared/user/user.model';
import { UserService } from '../../shared/user/user.service';

@Injectable()
export class TopicService {
  lastError = '';

  constructor(private cmsApiService: CmsApiService, private userService: UserService) { }

  public createTopic(topic: Topic) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let data = topic.JSON();
    // let data = '{"Title":"my Topic","Description":"my description",' +
    //   '"Deadline":"4/21/2014","Status":"InProgress",' +
    //   '"Requirements":"anything","ReviewerId":"2"}';

    console.log(data);
    return this.cmsApiService.postUrl('/api/Topics', data, { headers })
      .toPromise()
      .then(this.extractBooleanData)
      .catch(this.handleError);
  }

  public deleteTopic(id: number) {
    return this.cmsApiService.deleteUrl('/api/topics/' + id, {})
      .toPromise()
      .then(this.extractBooleanData)
      .catch(this.handleError);
  }

  public getTopic(id: number) {
    return this.cmsApiService.getUrl('/api/topics/' + id, {})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public findTopic(query: string) {
    return this.cmsApiService.getUrl('/api/topics/' + query, {})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  public getAllTopics() {
    return this.cmsApiService.getUrl('/api/topics', {})
      .toPromise()
      .then(
        response => this.extractArrayData(response)
      ).catch(this.handleError);
  }

  public updateTopic(topic: Topic) {
    let data = JSON.stringify(topic);
    return this.cmsApiService.postUrl('/api/topics/' + topic.id, data, {})
      .toPromise()
      .then(this.extractBooleanData)
      .catch(this.handleError);
  }


  private parseJSON(obj: any): Topic {
    let topic = Topic.emptyTopic();
    topic.id = obj.id;
    topic.title = obj.title;
    topic.description = obj.description;
    topic.status = obj.status;
    topic.requirements = obj.requirements;
    topic.content = obj.content;
    topic.deadline = obj.deadline;
    topic.creation_time = obj.creation_time;

    console.log(obj.reviewerId);
    if (obj.reviewerId !== undefined && obj.reviewerId !== null) {
      this.userService.getUser(<number> obj.reviewerId).then(
        user => topic.reviewer = <User> user
      ).catch(
        error => console.log(error)
      );
    }
    if (obj.students !== undefined) {
      topic.students = this.getUserArray(<number[]> obj.students);
    }
    if (obj.supervisors !== undefined) {
      topic.supervisors = this.getUserArray(<number[]> obj.supervisors);
    }
    if (obj.subTopics !== undefined) {
      topic.subTopics = this.getTopicArray(<number[]> obj.subTopics);
    }
    if (obj.parentTopics !== undefined) {
      topic.parentTopics = this.getTopicArray(<number[]> obj.parentTopics);
    }

    return topic;
  }

  private getUserArray(ids: number[]): User[] {
    let users: User[] = [];
    if (ids === null) {
      return users;
    }
    console.log(ids);
    if (ids.length > 0) {
      for (let id of ids) {
        this.userService.getUser(<number> id).then(
          user => users.push(user)
        ).catch(
          error => console.log(error)
        );
      }
    }
    return users;
  }

  private getTopicArray(ids: number[]): Topic[] {
    let topics: Topic[] = [];
    if (ids === null) {
      return topics;
    }
    if (ids.length > 0) {
      for (let id of ids) {
        this.getTopic(<number> id).then(
          user => topics.push(user)
        ).catch(
          error => console.log(error)
        );
      }
    }
    return topics;
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

  private extractData(res: Response): Topic {
    let body = res.json();
    let topic = this.parseJSON(body);
    console.log(topic);

    return topic;
  }

  private extractArrayData(res: Response): Topic[] {
    let body = res.json();
    console.log(body.items);
    let topics: Topic[] = [];
    for (let topic of body.items) {
      topics.push(this.parseJSON(topic));
    }
    console.log(topics);
    return topics || [];
  }

}
