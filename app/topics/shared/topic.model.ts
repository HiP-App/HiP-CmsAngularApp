import { User } from '../../shared/user/user.model';

/**
 * This class represents a topic in our System
 */
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

  
  expanded = false;
  displayContent = false;
  icon = '+';


  /**
   * Method to get an empty topic easily. Use this method, if you need a topic
   * (for example if you are waiting for a response, but you need a dummy topic directly)
   * @param parentTopics optional parameter, if you create a subtopic set this.
   * @returns {Topic} returns an empty topic
   */
   static emptyTopic(parentTopics: Topic[] = []) {
     let inAMonth = new Date();
     inAMonth.setDate(inAMonth.getDate() + 30);
     return new Topic(-1, '', '', 'InProgress', null, User.getEmptyUser(),
       null, '', '', inAMonth.toISOString(), new Date().toISOString(), null, parentTopics);
   }

  /**
   * Constructor for a Topic.
   * @param id Id of an topic, set to -1 if the topic do not have an Id yet
   * @param title Title of the topic
   * @param description Description of the topic
   * @param status Staus of the Topic, can be set to 'Todo', 'InProgress', 'InReview', 'Done'
   * @param students The students assigned to the topic
   * @param reviewer The Supervisor, who will review the topic
   * @param supervisors Assigned supervisors
   * @param requirements Informal requirements
   * @param content The Content for the topic (for now just a string)
   * @param deadline Date to which the topic shall be done
   * @param creation_time Date, when the Topic was created
   * @param subTopics An Array of Topics, which are subtopics of this topic
   * @param parentTopics An Array of Topics, which are parent topics of this topic
   */
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

  /**
   * Method to create a JSON string from a Topic
   * @returns {string} JSON String, representing this topic
   */
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

   toggle(topic: any) {
     this.expanded = !this.expanded;
   }

   toggleContent() {
     this.displayContent = !this.displayContent;
   }

   get getIcon() {
     if(this.expanded) {
       return '-';
     }
     else {
       return '+';
     }
   }

 }


