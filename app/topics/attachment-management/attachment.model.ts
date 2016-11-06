import { Response } from '@angular/http';

/**
 * This class represents an attachment to a topic in our System.
 */
export class Attachment {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  topicId: number;

  /**
   * Creates a new attachment.
   *
   * @param id the ID of the attachment, set to -1 if no ID is assigned
   * @param name the name of the attachment
   * @param description the description
   * @param createdAt the date the attachment was created
   * @param topicId the ID of the topic the attachment belongs to
   */
  constructor(id: number,
              name: string,
              description: string,
              createdAt: Date,
              topicId: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.topicId = topicId;
  }

  public getFormData() {
    let data = '';
    data += 'AttatchmentName=' + this.name + '&';
    data += 'Description=' + this.description + '&';
    return data;
  }

  /**
   * Creates an empty attachment easily.
   * Use this method, if you need an attachment (for example waiting for a response, but you need a dummy attachment).
   *
   * @returns {Attachment} returns an empty attachment
   */
  public static emptyAttachment(topicId: number = -1): Attachment {
    return new Attachment(-1, '', '', new Date(), topicId);
  }

  /**
   * Creates an attachment from the given JSON data.
   *
   * @param obj the JSON data
   * @param topicId the ID of the topic the attachment belongs to
   * @returns {Attachment} the attachment created
   */
  public static parseJSON(obj: any, topicId: number): Attachment {
    let attachment = Attachment.emptyAttachment();
    attachment.id = obj.id;
    attachment.name = obj.name;
    attachment.description = obj.description;
    attachment.createdAt = obj.createdAt;
    attachment.topicId = topicId;
    return attachment;
  }

  public static extractData(res: Response, topicId: number): Attachment {
    let body = res.json();
    let attachment = Attachment.parseJSON(body, topicId);
    return attachment;
  }

  public static extractArrayData(res: Response, topicId: number): Attachment[] {
    let body = res.json();
    let attachments: Attachment[] = [];
    if (body === undefined) {
      return attachments;
    }
    for (let attachment of body) {
      attachments.push(this.parseJSON(attachment, topicId));
    }
    return attachments || [];
  }
}
