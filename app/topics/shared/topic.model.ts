export class Topic {
  title: string = '';
  students: string = '';
  reviewer: string = '';
  requirements: string = '';
  status: string = '';
  supervisors: string = '';
  content: string = '';
  description: string = '';
  dueDate: Date = new Date('today');
  subTopics: Topic[] = [];
  parentTopics: Topic[] = [];

  constructor(title = '',
              students = '',
              reviewer = '',
              requirements = '',
              status = '',
              supervisors = '',
              content = '',
              description = '',
              dueDate = new Date('today')) {
    this.title = title;
    this.students = students;
    this.reviewer = reviewer;
    this.requirements = requirements;
    this.status = status;
    this.supervisors = supervisors;
    this.content = content;
    this.description = description;
    this.dueDate = dueDate;
  }
}


