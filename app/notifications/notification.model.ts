import { Response } from '@angular/http';

export class Notification {
  private id: number;
  private text: string;
  private link: string;
  private timestamp: Date;
  private type: string;
  private read: boolean;

  constructor(id: number,
              text: string,
              link: string,
              timestamp: Date,
              type: string,
              read: boolean) {
    this.id = id;
    this.text = text;
    this.link = link;
    this.timestamp = timestamp;
    this.type = type;
    this.read = read;
  }

  public static extractData(res: Response): Notification[] {
    let body = res.json();
    let notifications: Notification[] = [];
    for (let notification of body) {
      notifications.push(Notification.parseJSON(notification));
    }
    return notifications;
  }

  public static parseJSON(obj: any): Notification {
    let text = obj.data;
    let link = '';
    switch (obj.type) {
      case 'TOPIC_CREATED':
        text = 'The topic ' + obj.data[1] + ' was created.';
        link = 'topics/' + obj.data[0];
        break;
      case 'TOPIC_ASSIGNED_TO':
        text = 'The topic ' + obj.data[1] + ' was assigned to you.';
        link = 'topics/' + obj.data[0];
        break;
      case 'TOPIC_REMOVED_FROM':
        text = 'You were removed from the topic ' + obj.data[1] + '.';
        link = 'topics/' + obj.data[0];
        break;
      case 'TOPIC_STATE_CHANGED':
        text = 'The state of the topic ' + obj.data[1] + ' changed to ' + obj.data[2] + '.';
        link = 'topics/' + obj.data[0];
        break;
      case 'TOPIC_DEADLINE_CHANGED':
        text = 'The deadline for the topic ' + obj.data[1] + ' was changed to ' + obj.data[2] + '.';
        link = 'topics/' + obj.data[0];
        break;
      case 'TOPIC_DELETED':
        text = 'The topic ' + obj.data[0] + ' was deleted.';
        break;
      case 'TOPIC_UPDATED':
        text = 'The Topic ' + obj.data[1] + ' was updated.';
        link = 'topics/' + obj.data[0];
        break;
      case 'TOPIC_ATTACHMENT_ADDED':
        text = 'The Attachment ' + obj.data[2] + ' was added to the topic ' + obj.data[1] + '.';
        link = 'topics/' + obj.data[0];
        break;
    }
    return new Notification(obj.notificationId, text, link, obj.timeStamp, obj.type, obj.isRead);
  }
}
