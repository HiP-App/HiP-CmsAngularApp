import { Response } from '@angular/http';

/**
 * This class represents an attachment with its metadata.
 */
export class Attachment {
  id: number;
  createdAt: Date;
  topicId: number;
  user: string;

  title: string;
  details: string = undefined;
  type: string = undefined;
  subType: string = undefined;
  photographer: string = undefined;
  creator: string = undefined;
  material: string = undefined;
  height: number = undefined;
  width: number = undefined;
  depth: number = undefined;
  unit: string = undefined;
  date: string = undefined;
  date2: string = undefined;
  source: string;
  copyright: string = undefined;
  location: string = undefined;
  signature: string = undefined;
  page: number = undefined;
  pointOfOrigin: string = undefined;
  placeOfManufacture: string = undefined;
  detailedPosition: string = undefined;

  public static attachmentTypes = [ 'PHOTOGRAPH', 'ARCHITECTURAL_DRAWING', 'ARCHITECTURE', 'BUILDING_ARTWORK',
    'MUSEOLOGICAL_ARTWORK', 'PAGE', 'CITY_MAP', 'POST_CARD' ];
  public static attachmentSubTypesForArchitecturalDrawings = [ 'GROUND_PLAN', 'FRONT_EVEVATION', 'RECONSTRUCTION' ];
  public static units = [ 'mm', 'cm', 'dm', 'm' ];

  /**
   * Creates a new attachment.
   *
   * @param id the ID of the attachment, set to -1 if no ID is assigned
   * @param title the title of the attachment
   * @param source the source
   * @param createdAt the date the attachment was uploaded
   * @param topicId the ID of the topic the attachment belongs to
   * @param user the user who uploaded the attachment
   */
  constructor(id: number,
              title: string,
              source: string,
              createdAt: Date,
              topicId: number,
              user: string) {
    this.id = id;
    this.title = title;
    this.source = source;
    this.createdAt = createdAt;
    this.topicId = topicId;
    this.user = user;
  }

  /**
   * Creates an empty attachment.
   * Use this method, if you need an attachment (for example waiting for a response, but you need a dummy attachment).
   * @returns {Attachment} returns an empty attachment
   */
  public static emptyAttachment(topicId: number = -1): Attachment {
    return new Attachment(-1, '', '', new Date(), topicId, '');
  }

  /**
   * Creates an attachment from the given JSON data.
   * @param obj the JSON data
   * @param topicId the ID of the topic the attachment belongs to
   * @returns {Attachment} the created attachment model
   */
  public static parseJSON(obj: any, topicId: number): Attachment {
    let attachment = Attachment.emptyAttachment();
    attachment.id = obj.id;
    attachment.title = obj.name;
    attachment.details = obj.description;
    if (obj.legal) {
      attachment.copyright = obj.legal;
    }
    attachment.createdAt = obj.createdAt;
    attachment.topicId = topicId;
    attachment.user = obj.user.fullName;
    return attachment;
  }

  /**
   * Extracts the attachment data from a HTTP response containing one attachment.
   * @param res the HTTP response
   * @param topicId the ID of the topic the attachment belongs to
   * @returns {Attachment} the created attachment model
   */
  public static extractData(res: Response, topicId: number): Attachment {
    let body = res.json();
    return Attachment.parseJSON(body, topicId);
  }

  /**
   * Extracts the attachment data from a HTTP response containing an array of attachments.
   * @param res the HTTP response
   * @param topicId the ID of the topic the attachment belongs to
   * @returns {Attachment[]} the array of created attachment models
   */
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

  /**
   * Removes attributes which are not allowed for the type.
   */
  public checkConsistency(): void {
    if (this.type !== 'ARCHITECTURAL_DRAWING') {
      this.subType = undefined;
    }
    if (!this.canHavePhotographer()) {
      this.photographer = undefined;
    }
    if (!this.canHaveCreator()) {
      this.creator = undefined;
    }
    if (!this.canHaveHeightAndWidth()) {
      this.height = undefined;
      this.width = undefined;
    }
    if (!this.canHaveDepth()) {
      this.depth = undefined;
    }
    if (!this.canHaveUnit()) {
      this.unit = undefined;
    }
    if (!this.canHaveDateOfShot()) {
      this.date = undefined;
    }
    if (!this.canHaveRepositoryAndSignature()) {
      this.signature = undefined;
    }
    if (!this.canHaveLocation() && !this.canHaveRepositoryAndSignature()) {
      this.location = undefined;
    }
    if (!this.canHavePointOfOrigin()) {
      this.pointOfOrigin = undefined;
    }
    if (!this.canHavePlaceOfManufacture()) {
      this.placeOfManufacture = undefined;
    }
    if (!this.canHaveDetailedPosition()) {
      this.detailedPosition = undefined;
    }
  }

  /**
   * Returns whether the photographer attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHavePhotographer(): boolean {
    return this.type !== 'ARCHITECTURAL_DRAWING';
  }

  /**
   * Returns whether the creator attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveCreator(): boolean {
    return this.type !== 'PHOTOGRAPH' && this.type !== 'POST_CARD';
  }

  /**
   * Returns whether the attributes height and width allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveHeightAndWidth(): boolean {
    return this.type === 'PHOTOGRAPH' || this.type === 'ARCHITECTURE' || this.type === 'BUILDING_ARTWORK'
            || this.type === 'MUSEOLOGICAL_ARTWORK' || this.type === 'PAGE';
  }

  /**
   * Returns whether the depth attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveDepth(): boolean {
    return this.type === 'ARCHITECTURE' || this.type === 'BUILDING_ARTWORK' || this.type === 'MUSEOLOGICAL_ARTWORK';
  }

  /**
   * Returns whether the unit attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveUnit(): boolean {
    return this.canHaveHeightAndWidth() || this.canHaveDepth();
  }

  /**
   * Returns whether the date of shot attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveDateOfShot(): boolean {
    return this.type === 'PHOTOGRAPH' || this.type === 'ARCHITECTURAL_DRAWING' || this.type === 'ARCHITECTURE'
            || this.type === 'CITY_MAP';
  }

  /**
   * Returns whether the date2 attribute is allowed for the type and named date of print.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveDateofPrint(): boolean {
    return this.type === 'PHOTOGRAPH';
  }

  /**
   * Returns whether the date2 attribute is allowed for the type and named age determination.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveAgeDetermination(): boolean {
    return !this.canHaveDateofPrint();
  }

  /**
   * Returns whether the location attribute is allowed for the type and used to save the current location.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveLocation(): boolean {
    return this.type === 'ARCHITECTURE' || this.type === 'BUILDING_ARTWORK';
  }

  /**
   * Returns whether the location attribute is allowed for the type and used to save the current repository.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveRepositoryAndSignature(): boolean {
    return this.type === 'PHOTOGRAPH' || this.type === 'MUSEOLOGICAL_ARTWORK' || this.type === 'PAGE'
            || this.type === 'CITY_MAP';
  }

  /**
   * Returns whether the page attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHavePage(): boolean {
    return this.type === 'PAGE';
  }

  /**
   * Returns whether the point of origin attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHavePointOfOrigin(): boolean {
    return this.type === 'MUSEOLOGICAL_ARTWORK' || this.type === 'PAGE';
  }

  /**
   * Returns whether the place of manufacture attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHavePlaceOfManufacture(): boolean {
    return this.type === 'BUILDING_ARTWORK' || this.type === 'MUSEOLOGICAL_ARTWORK' || this.type === 'PAGE';
  }

  /**
   * Returns whether the detailed position attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveDetailedPosition(): boolean {
    return this.type === 'ARCHITECTURE' || this.type === 'BUILDING_ARTWORK';
  }

  /**
   * Returns whether attachment model is valid, i. e. whether it could be saved.
   * @returns {boolean} true if and only if the model is vaid
   */
  public isValid(): boolean {
    return this.isTitleValid() && this.isSourceValid()
        && Attachment.attachmentTypes.includes(this.type) // the type must be defined
        && (Attachment.attachmentSubTypesForArchitecturalDrawings.includes(this.subType)
              || this.type !== 'ARCHITECTURAL_DRAWING') // if architectural drawing also the type must be defined
        && ((this.width === undefined && this.height === undefined && this.depth === undefined)
              || this.unit !== undefined); // if width, height or depth is defined, the unit must be also defined
  }

  /**
   * Returns whether the title is valid.
   * @returns {boolean} true if and only if the title is set to a string unequal to the empty string
   */
  public isTitleValid(): boolean {
    return this.title !== undefined && this.title.trim().length > 0;
  }

  /**
   * Returns whether the source is valid.
   * @returns {boolean} true if and only if the source is set to a string unequal to the empty string
   */
  public isSourceValid(): boolean {
    return this.source !== undefined && this.source.trim().length > 0;
  }

}
