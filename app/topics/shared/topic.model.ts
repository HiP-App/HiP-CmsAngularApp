import { Response } from '@angular/http';

import { User } from '../../core/user/user.model';

/**
 * This class represents a topic in our System
 */
export class Topic {
  content: string;
  createdAt: string;
  createdById: number;
  deadline: string;
  description: string;
  id: number;
  parentTopics: Topic[];
  requirements: string;
  reviewers: User[];
  status: string;
  students: User[];
  subTopics: Topic[];
  supervisors: User[];
  title: string;

  public static extractData(res: Response): Topic {
    let body = res.json();
    return this.parseJSON(body);
  }

  public static extractPaginationedArrayData(res: Response): Topic[] {
    let body = res.json();
    let topics: Topic[] = [];
    if (body.items === undefined) {
      return topics;
    }
    for (let topic of body.items) {
      topics.push(this.parseJSON(topic));
    }
    return topics || [];
  }


  public static extractArrayData(res: Response): Topic[] {
    let body = res.json();
    let topics: Topic[] = [];
    if (body === undefined) {
      return topics;
    }
    for (let topic of body) {
      topics.push(this.parseJSON(topic));
    }
    return topics || [];
  }

  public static extractSubTopicsArrayData(res: Response): Topic[] {
    let body = res.json();
    let topics: Topic[] = [];
    for (let topic of body) {
      topics.push(this.parseJSON(topic));
    }
    return topics || [];
  }

  static parseJSON(obj: any): Topic {
    let topic = Topic.emptyTopic();
    topic.id = obj.id;
    topic.title = obj.title;
    topic.description = obj.description;
    topic.status = obj.status;
    topic.requirements = obj.requirements;
    topic.deadline = obj.deadline;
    topic.createdAt = obj.createdAt;
    topic.createdById = obj.createdById;
    return topic;
  }

  /**
   * Method to get an empty topic easily. Use this method, if you need a topic
   * (for example if you are waiting for a response, but you need a dummy topic directly)
   * @param parentTopics optional parameter, if you create a subtopic set this.
   * @returns {Topic} returns an empty topic
   */
  static emptyTopic(parentTopics: Topic[] = []) {
    let inAMonth = new Date();
    inAMonth.setDate(inAMonth.getDate() + 30);
    return new Topic(-1, '', '', 'InProgress', new Array<User>(), new Array<User>(),
        new Array<User>(), '', '', inAMonth.toISOString(), new Date().toISOString(), null, parentTopics);
  }

  /**
   * Constructor for a Topic.
   * @param id Id of an topic, set to -1 if the topic do not have an Id yet
   * @param title Title of the topic
   * @param description Description of the topic
   * @param status Status of the Topic, can be set to 'Todo', 'InProgress', 'InReview', 'Done'
   * @param students The students assigned to the topic
   * @param reviewers The Supervisors, who will review the topic
   * @param supervisors Assigned supervisors
   * @param requirements Informal requirements
   * @param content The Content for the topic (for now just a string)
   * @param deadline Date to which the topic shall be done
   * @param createdAt Date, when the Topic was created
   * @param subTopics An Array of Topics, which are subtopics of this topic
   * @param parentTopics An Array of Topics, which are parent topics of this topic
   */
  constructor(id: number,
              title: string,
              description: string,
              status: string,
              students: User[],
              reviewers: User[],
              supervisors: User[],
              requirements: string,
              content: string,
              deadline: string,
              createdAt: string,
              subTopics: Topic[],
              parentTopics: Topic[]) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.students = students;
    this.reviewers = reviewers;
    this.supervisors = supervisors;
    this.requirements = requirements;
    this.content = content;
    this.deadline = deadline;
    this.createdAt = createdAt;
    this.subTopics = subTopics;
    this.parentTopics = parentTopics;
  }

  public hasSubtopics() {
    if (this.subTopics === null || this.subTopics === undefined) {
      return false;
    }
    return this.subTopics.length > 0;
  }

  public hasParentTopics() {
    if (this.parentTopics === null || this.parentTopics === undefined) {
      return false;
    }
    return this.parentTopics.length > 0;
  }

}
