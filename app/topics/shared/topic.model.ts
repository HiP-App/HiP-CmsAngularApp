import { User } from '../../shared/user/user.model';

export class Topic {
  content: string;  // TODO create class content?
  creation_time: string;
  deadline: string;
  description: string;
  id: number;
  parentTopics: Topic[];
  requirements: string;
  reviewer: User;
  reviewerId: number;
  status: string;
  students: User[];
  subTopics: Topic[];
  supervisors: User[];
  title: string;


  static emptyTopic(parentTopics: Topic[] = []) {
    let inAMonth = new Date();
    inAMonth.setDate(inAMonth.getDate() + 30);
    return new Topic(-1, '', '', 'InProgress', null, User.getEmptyUser(),
      null, '', '', inAMonth.toISOString(), new Date().toISOString(), null, parentTopics);
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
              deadline: string,
              creation_time: string,
              subTopics: Topic[],
              parentTopics: Topic[]
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.students = students;
    this.reviewer = reviewer;
    this.reviewerId = reviewer.id === -1 ? null : reviewer.id;
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
    data += 'ReviewerId=' + this.reviewerId + '&';
    data += 'Students=' + this.userArrayJSON(this.students) + '&';
    data += 'Supervisors=' + this.userArrayJSON(this.supervisors) + '';

    return data;
  }

  private userArrayJSON(users: User[]) {
    let ids: number[] = [];
    if (users === null) {
      return;
    }
    if (users.length > 0) {
      for (let user of users) {
        ids.push(user.id);
      }
    }
    return JSON.stringify(ids);
  }
}


