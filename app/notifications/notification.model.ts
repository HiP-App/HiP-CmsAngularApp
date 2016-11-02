import { Response } from '@angular/http';

export class Notification {
  private id: number;
  private text: string;
  private timestamp: Date;
  private type: string;
  private read: boolean;

  constructor(id: number,
              text: string,
              timestamp: Date,
              type: string,
              read: boolean) {
    this.id = id;
    this.text = text;
    this.timestamp = timestamp;
    this.type = type;
    this.read = read;
  }

  public static extractData(res: Response): Notification {
    let body = res.json();
    let notification = this.parseJSON(body);
    return notification;
  }

  public static parseJSON(obj: any): Notification {
    return new Notification(obj.id, obj.text, obj.timestamp, obj.type, obj.read);
  }
}
