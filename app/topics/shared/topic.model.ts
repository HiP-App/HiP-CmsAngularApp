export class Topic {
  title: string = '';
  students: string = '';
  reviewer: string = '';
  requirements: string = '';
  status: string = '';
  supervisor: string = '';
  content: string = '';
  dueDate: Date = new Date('today');
  subTopics: Topic[] = [];
  parentTopics: Topic[] = [];
}