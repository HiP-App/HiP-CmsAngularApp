import { User } from '../../shared/user/user.model';

export class Topic {
  expanded = false;
  displayContent = false;

  content: string;  // TODO create class content?
  creation_time: Date;
  deadline: Date;
  description: string;
  id: number;
  parentTopics: Topic[];
  requirements: string;
  reviewer: User;
  status: string;
  students: User[];
  subTopics: Topic[];
  supervisors: User[];
  title: string;


  static emptyTopic(parentTopics: Topic[] = []) {
    return new Topic(-1, '', '', '', [], User.getEmptyUser(), [], '', '', null, new Date(), [], parentTopics);
  }

  constructor(id: number,
              title: string,
              description: string,
              status: string,
              students: User[],
              reviewer: User,
              supervisors: User[],
              requirements: string,
              content: string,
              deadline: Date,
              creation_time: Date,
              subTopics: Topic[],
              parentTopics: Topic[]) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
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

  JSON() {
    let json = '{';
    json += '"Title":"' + this.title + '",';
    json += '"Description":"' + this.description + '",';
    json += '"Deadline":"' + this.deadline + '",';
    json += '"Status":"' + this.status + '",';
    json += '"Requirements":"' + this.requirements + '",';
    json += '"ReviewerId":"' + this.reviewer.id + '",';
    json += '"Students":"' + this.userArrayJSON(this.students) + '",';
    json += '"Supervisors":"' + this.userArrayJSON(this.supervisors) + '",';

    return json;
  }

  private userArrayJSON(users: User[]) {
    let ids: number[] = []
    if (users.length > 0) {
      for (let user of users) {
        ids.push(user.id);
      }
    }
    return JSON.stringify(ids);
  }

  private toggle() {
    this.expanded = !this.expanded;
  }
  private toggleContent() {
    this.displayContent = !this.displayContent;
  }

  private getIcon() {
    if(this.expanded) {
      return '-';
    }
    else {
      return '+';
    }
  }
}


