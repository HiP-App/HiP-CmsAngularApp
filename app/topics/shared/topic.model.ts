import { User } from '../../shared/user/user.model';
import { Response } from '@angular/http';

/**
 * This class represents a topic in our System
 */
export class Topic {
  content: string;  // TODO create class content?
  createdAt: string;
  createdBy: User;
  createdById: number;
  deadline: string;
  description: string;
  id: number;
  parentTopics: Topic[];
  requirements: string;
  reviewers: User[];
  reviewerId: number;
  status: string;
  students: User[];
  subTopics: Topic[];
  supervisors: User[];
  title: string;


  public static extractData(res: Response): Topic {
    let body = res.json();
    let topic = this.parseJSON(body);
    console.log(topic);

    return topic;
  }

  public static extractArrayData(res: Response): Topic[] {
    let body = res.json();
    console.log(body);
    let topics: Topic[] = [];
    for (let topic of body) {
      topics.push(this.parseJSON(topic));
    }
    console.log(topics);
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
    return new Topic(-1, '', '', 'InProgress', null, new Array<User>(),
      null, '', '', inAMonth.toISOString(), new Date().toISOString(), null, parentTopics);
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

  /**
   * Method to create a x-www-formdata string from a Topic
   * @returns {string} x-www-formdata String, representing this topic
   */
  formData() {
    let data = '';
    if (this.id !== -1) {
      data += 'id=' + this.id + '&';
    }
    data += 'Title=' + this.title + '&';
    data += 'Description=' + this.description + '&';
    data += 'Deadline=' + this.deadline + '&';
    data += 'Status=' + this.status + '&';
    data += 'Requirements=' + this.requirements + '&';
    data += this.userArrayJSON(this.reviewers, 'Reviewers[]=');
    data += this.userArrayJSON(this.students, 'Students[]=');
    data += this.userArrayJSON(this.supervisors, 'Supervisors[]=');
    data += this.topicArrayJSON(this.subTopics, 'AssociatedTopics[]=');

    return data;
  }

  private userArrayJSON(users: User[], preString: string) {
    let query = '';
    if (users === null) {
      return query;
    }
    if (users.length > 0) {
      for (let user of users) {
        query += preString + user.id + '&';
      }
    }
    return query;
  }

  private topicArrayJSON(topics: Topic[], preString: string) {
    let query = '';
    if (topics === null) {
      return query;
    }
    if (topics.length > 0) {
      for (let topic of topics) {
        query += preString + topic.id + '&';
      }
    }
    return query;
  }
}


