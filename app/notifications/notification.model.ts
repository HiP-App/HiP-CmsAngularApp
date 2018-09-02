import { Response } from '@angular/http';

export class Notification {
  id: number;
  text: string;
  link: string;
  timestamp: Date;
  type: string;
  read: boolean;
  s1: string;
  s2: string;
  totalItems: number;

  constructor(id: number,
              text: string,
              link: string,
              timestamp: Date,
              type: string,
              read: boolean,
              s1: string,
              s2: string) {
    this.id = id;
    this.text = text;
    this.link = link;
    this.timestamp = timestamp;
    this.type = type;
    this.read = read;
    this.s1 = s1;
    this.s2 = s2;
  }

  public static extractData(res: Response, currentPage = 1, pageSize = 0): any {
    let body = res.json();
    let notifications: Notification[] = [];
    if (pageSize === 0) {
      pageSize = body.length;
    }
    for (let i = (currentPage - 1) * pageSize ; i < currentPage * pageSize && i < body.length; i++) {
      notifications.push(Notification.parseJSON(body[i]));
    }
    return notifications;
  }

  public static parseJSON(obj: any): Notification {
    let text = obj.data;
    let link = '';
    let s1 = '';
    let s2 = '';
    switch (obj.type) {
      case 'TOPIC_CREATED':
        text = 'The topic {{s1}} was created.';
        s1 = obj.data[1];
        link = '/topics/' + obj.data[0];
        break;
      case 'TOPIC_ASSIGNED_TO':
        text = 'The topic {{s1}} was assigned to you.';
        s1 = obj.data[1];
        link = '/topics/' + obj.data[0];
        break;
      case 'TOPIC_REMOVED_FROM':
        text = 'You were removed from the topic {{s1}}.';
        s1 = obj.data[1];
        link = '/topics/' + obj.data[0];
        break;
      case 'TOPIC_STATE_CHANGED':
        text = 'The state of the topic {{s1}} changed to {{s2}}.';
        s1 = obj.data[1];
        s2 = obj.data[2];
        switch (obj.data[2]) {
          case 'InProgress':
            s2 = 'InProgress';
            break;
          case 'InReview':
            s2 = 'InReview';
            break;
          case 'Done':
            s2 = 'Done';
            break;
        }
        link = '/topics/' + obj.data[0];
        break;
      case 'TOPIC_DEADLINE_CHANGED':
        text = 'The deadline for the topic {{s1}} was changed to {{s2}}.';
        s1 = obj.data[1];
        s2 = obj.data[2];
        link = '/topics/' + obj.data[0];
        break;
      case 'TOPIC_DELETED':
        text = 'The topic {{s1}} was deleted.';
        s1 = obj.data[0];
        break;
      case 'TOPIC_UPDATED':
        text = 'The Topic {{s1}} was updated.';
        link = '/topics/' + obj.data[0];
        s1 = obj.data[1];
        break;
      case 'TOPIC_ATTACHMENT_ADDED':
        text = 'The Attachment {{s2}} was added to the topic {{s1}}.';
        s1 = obj.data[1];
        s2 = obj.data[2];
        link = '/topics/' + obj.data[0];
        break;
    }
    return new Notification(obj.notificationId, text, link, obj.timeStamp, obj.type, obj.isRead, s1, s2);
  }
}
