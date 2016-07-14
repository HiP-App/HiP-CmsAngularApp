import { User } from '../../shared/user/user.model';

export class Topic {
  content: string;  // TODO create class content?
  creation_time: Date;
  deadline: Date;
  description: string;
  id: number;
  parentTopics: Topic[];
  requirements: string;
  reviewer: User;
  state: string;
  students: User;
  subTopics: Topic[];
  supervisors: User;
  title: string;


  static emptyTopic(parentTopics: Topic[] = []) {
    return new Topic(-1, '', '', '', null, null, null, '', '', null, new Date(), [], parentTopics);
  }

  constructor(id: number,
              title: string,
              description: string,
              state: string,
              students: User,
              reviewer: User,
              supervisors: User,
              requirements: string,
              content: string,
              deadline: Date,
              creation_time: Date,
              subTopics: Topic[],
              parentTopics: Topic[]) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.state = state;
    this.students = students;
    this.reviewer = reviewer;
    this.supervisors = supervisors;
    this.requirements = requirements;
    this.content = content;
    this.deadline = deadline;
    this.creation_time = creation_time;
    this.subTopics = subTopics;
    this.parentTopics = parentTopics;
  }
}


