import { Response } from '@angular/http';

/**
 * This class represents an attachment to a topic in our System.
 */
export class Attachment {
  id: number;
  name: string;
  description: string;
  legal: string;
  contentType: string;
  contentDisposition: string;
  headers: any;
  length: number;
  fileName: string;
  topicId: number;

  /**
   * Creates a new attachment.
   *
   * @param id the ID of the attachment, set to -1 if no ID is assigned
   * @param name the name of the attachment
   * @param description the description
   * @param legal the legal notice
   * @param contentType
   * @param contentDisposition
   * @param headers
   * @param length
   * @param fileName
   * @param topicId the ID of the topic the attachment belongs to
   */
  constructor(id: number,
              name: string,
              description: string,
              legal: string,
              contentType: string,
              contentDisposition: string,
              headers: any,
              length: number,
              fileName: string,
              topicId: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.legal = legal;
    this.contentType = contentType;
    this.contentDisposition = contentDisposition;
    this.headers = headers;
    this.length = length;
    this.fileName = fileName;
    this.topicId = topicId;
  }

  public getFormData() {
    let data = '';
    if (this.id !== -1) {
      data += 'id=' + this.id + '&';
    }
    data += 'Name=' + this.name + '&';
    data += 'Description=' + this.description + '&';
    data += 'Legal=' + this.legal + '&';
    data += 'ContentType=' + this.contentType + '&';
    data += 'ContentDisposition=' + this.contentDisposition + '&';
    data += 'Headers=' + this.headers + '&';
    data += 'Length=' + this.length + '&';
    data += 'FileName=' + this.fileName + '&';
    data += 'topicId=' + this.topicId;
    return data;
  }

  /**
   * Creates an empty attachment easily.
   * Use this method, if you need an attachment (for example waiting for a response, but you need a dummy attachment).
   *
   * @returns {Attachment} returns an empty attachment
   */
  public static emptyAttachment(topicId: number = -1) {
    return new Attachment(-1, '', '', '', '', '', '', 0, '', topicId);
  }

  /**
   * Creates an attachment from the given JSON data.
   *
   * @param obj the JSON data
   * @returns {Attachment} the attachment created
   */
  public static parseJSON(obj: any): Attachment {
    let attachment = Attachment.emptyAttachment();
    attachment.id = obj.id;
    attachment.name = obj.title;
    attachment.description = obj.description;
    attachment.legal = obj.legal;
    attachment.contentType = obj.contentType;
    attachment.contentDisposition = obj.contentDisposition;
    attachment.headers = obj.headers;
    attachment.length = obj.length;
    attachment.fileName = obj.fileName;
    attachment.topicId = obj.topicId;
    return attachment;
  }

  public static extractData(res: Response): Attachment {
    let body = res.json();
    let attachment = Attachment.parseJSON(body);
    return attachment;
  }

  public static extractArrayData(res: Response): Attachment[] {
    let body = res.json();
    let attachments: Attachment[] = [];
    if (body === undefined) {
      return attachments;
    }
    for (let attachment of body) {
      attachments.push(this.parseJSON(attachment));
    }
    return attachments || [];
  }
}
