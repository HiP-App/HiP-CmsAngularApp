import { Response } from '@angular/http';

/**
 * This class represents an attachment with its metadata.
 */
export class Attachment {
  id: number;
  createdAt: Date;
  topicId: number;
  user: string;
  metadata: AttachmentMetadata = AttachmentMetadata.emptyAttachmentMetadata();

  public static attachmentTypes = [ 'PHOTOGRAPH', 'ARCHITECTURAL_DRAWING', 'ARCHITECTURE', 'BUILDING_ARTWORK',
    'MUSEOLOGICAL_ARTWORK', 'PAGE', 'CITY_MAP', 'POST_CARD' ];
  public static attachmentSubTypesForArchitecturalDrawings = [ 'FRONT_ELEVATION', 'FLOOR_PLAN', 'SIDE_ELEVATION',
    'LONGITUDINAL SECTION', 'CROSS SECTION', 'AXONOMETRY', 'RECONSTRUCTION' ];
  public static attachmentSubTypesForBuildingArtworks = [ 'SCULPTURE', 'PANEL_PAINTING', 'GLASS_PAINTING',
    'HANDCRAFT', 'GOLDWORK' ];
  public static units = [ 'mm', 'cm', 'dm', 'm' ];

  /**
   * Creates a new attachment.
   *
   * @param id the ID of the attachment, set to -1 if no ID is assigned
   * @param createdAt the date the attachment was uploaded
   * @param topicId the ID of the topic the attachment belongs to
   * @param user the user who uploaded the attachment
   */
  constructor(id: number,
              createdAt: Date,
              topicId: number,
              user: string) {
    this.id = id;
    this.createdAt = createdAt;
    this.topicId = topicId;
    this.user = user;
    this.metadata = new AttachmentMetadata();
  }

  /**
   * Creates an empty attachment.
   * Use this method, if you need an attachment (for example waiting for a response, but you need a dummy attachment).
   * @returns {Attachment} returns an empty attachment
   */
  public static emptyAttachment(topicId: number = -1): Attachment {
    return new Attachment(-1, new Date(), topicId, '');
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
    attachment.createdAt = obj.createdAt;
    attachment.topicId = topicId;
    attachment.user = obj.user.fullName;

    // metadata, can be NULL
    if (obj.metadata) {
      attachment.metadata = new AttachmentMetadata(obj.metadata);
    }
    attachment.metadata.title = obj.title;

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
    if (!this.isSubTypeValid()) {
      this.metadata.subType = undefined;
    }
    if (!this.canHavePhotographer()) {
      this.metadata.photographer = undefined;
    }
    if (!this.canHaveCreator()) {
      this.metadata.creator = undefined;
    }
    if (!this.canHaveHeightAndWidth()) {
      this.metadata.height = undefined;
      this.metadata.width = undefined;
    }
    if (!this.canHaveDepth()) {
      this.metadata.depth = undefined;
    }
    if (!this.canHaveUnit()) {
      this.metadata.unit = undefined;
    }
    if (!this.canHaveDate()) {
      this.metadata.date = undefined;
    }
    if (!this.canHaveRepositoryAndSignature()) {
      this.metadata.signature = undefined;
    }
    if (!this.canHaveLocation() && !this.canHaveRepositoryAndSignature()) {
      this.metadata.location = undefined;
    }
    if (!this.canHavePointOfOrigin()) {
      this.metadata.pointOfOrigin = undefined;
    }
    if (!this.canHavePlaceOfManufacture()) {
      this.metadata.placeOfManufacture = undefined;
    }
    if (!this.canHaveDetailedPosition()) {
      this.metadata.detailedPosition = undefined;
    }
  }

  /**
   * Returns whether the selected attachment type of attachment has a subtype.
   * @returns {boolean} true if and only if the subtype attribute can and must be specified
   */
  public hasSubType(): boolean {
    return this.metadata.type === 'ARCHITECTURAL_DRAWING' || this.metadata.type === 'BUILDING_ARTWORK';
  }

  /**
   * Returns the list of options for the subtype selection, depending on the attachment type.
   * @returns {string[]} the list of options
   */
  public getOptionsForSubType(): string[] {
    switch (this.metadata.type) {
      case 'ARCHITECTURAL_DRAWING':
        return Attachment.attachmentSubTypesForArchitecturalDrawings;
      case 'BUILDING_ARTWORK':
        return Attachment.attachmentSubTypesForBuildingArtworks;
      default:
        return [];
    }
  }

  /**
   * Returns the label for the subtype.
   * @returns {string} the label for the subtype
   */
  public getLabelForSubtype(): string {
    switch (this.metadata.type) {
      case 'ARCHITECTURAL_DRAWING':
        return 'type of architectural drawing';
      case 'BUILDING_ARTWORK':
        return 'type of building artwork';
      default:
        return '';
    }
  }

  /**
   * Returns the label for the title.
   * @returns {string} the label for the title
   */
  public getLabelForTitle(): string {
    switch (this.metadata.type) {
      case 'ARCHITECTURAL_DRAWING':
        return 'title with unique identification mark of the diagrammed building';
      case 'ARCHITECTURE':
        return 'name of the building';
      case 'BUILDING_ARTWORK':
        return 'title of the artwork';
      case 'PAGE':
        return 'title of the handwriting';
      default:
        return 'title';
    }
  }

  /**
   * Returns whether the photographer attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHavePhotographer(): boolean {
    return this.metadata.type !== 'ARCHITECTURAL_DRAWING';
  }

  /**
   * Returns whether the creator attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveCreator(): boolean {
    return this.metadata.type !== 'PHOTOGRAPH' && this.metadata.type !== 'POST_CARD';
  }

  /**
   * Returns the label for the creator, depending on the attachment type.
   * @returns {string} the label for the creator
   */
  public getLabelForCreator(): string {
    if (!this.canHaveCreator()) {
      return '';
    }
    switch (this.metadata.type) {
      case 'ARCHITECTURAL_DRAWING':
      case 'PAGE':
        return 'author';
      case 'ARCHITECTURE':
        return 'architect';
      case 'BUILDING_ARTWORK':
      case 'MUSEOLOGICAL_ARTWORK':
        return 'artist';
      case 'CITY_MAP':
        return 'author or designer';
    }
  }

  /**
   * Returns whether the attributes height and width allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveHeightAndWidth(): boolean {
    return this.metadata.type === 'PHOTOGRAPH' || this.metadata.type === 'ARCHITECTURE'
            || this.metadata.type === 'BUILDING_ARTWORK'
            || this.metadata.type === 'MUSEOLOGICAL_ARTWORK' || this.metadata.type === 'PAGE';
  }

  /**
   * Returns whether the depth attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveDepth(): boolean {
    return this.metadata.type === 'ARCHITECTURE' || this.metadata.type === 'BUILDING_ARTWORK'
            || this.metadata.type === 'MUSEOLOGICAL_ARTWORK';
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
  public canHaveDate(): boolean {
    return this.metadata.type === 'PHOTOGRAPH' || this.metadata.type === 'ARCHITECTURAL_DRAWING'
            || this.metadata.type === 'ARCHITECTURE' || this.metadata.type === 'CITY_MAP';
  }

  /**
   * Returns the label for the date attribute, depending on the attachment type.
   * @returns {string} the label for the date attribute
   */
  public getLabelForDate(): string {
    switch (this.metadata.type) {
      case 'ARCHITECTURAL_DRAWING':
        return 'date of architectural drawing';
      case 'CITY_MAP':
        return 'date of the city map';
      default:
        return 'date of shot';
    }
  }

  /**
   * Returns the name for the date2 attribute, depending on the attachment type.
   * @returns {string} the name for the date2 attribute
   */
  public getLabelForDate2(): string {
    switch (this.metadata.type) {
      case 'PHOTOGRAPH':
        return 'date of the print';
      case 'ARCHITECTURAL_DRAWING':
      case 'ARCHITECTURE':
        return 'date of the building';
      case 'CITY_MAP':
        return 'date of the urbanistic status';
      default:
        return 'date';
    }
  }

  /**
   * Returns whether the location attribute is allowed for the type and used to save the current location.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveLocation(): boolean {
    return this.metadata.type === 'ARCHITECTURE' || this.metadata.type === 'BUILDING_ARTWORK';
  }

  /**
   * Returns whether the location attribute is allowed for the type and used to save the current repository.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveRepositoryAndSignature(): boolean {
    return this.metadata.type === 'PHOTOGRAPH' || this.metadata.type === 'MUSEOLOGICAL_ARTWORK'
      || this.metadata.type === 'PAGE' || this.metadata.type === 'CITY_MAP';
  }

  /**
   * Returns whether the page attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHavePage(): boolean {
    return this.metadata.type === 'PAGE';
  }

  /**
   * Returns whether the point of origin attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHavePointOfOrigin(): boolean {
    return this.metadata.type === 'MUSEOLOGICAL_ARTWORK' || this.metadata.type === 'PAGE';
  }

  /**
   * Returns whether the place of manufacture attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHavePlaceOfManufacture(): boolean {
    return this.metadata.type === 'BUILDING_ARTWORK' || this.metadata.type === 'MUSEOLOGICAL_ARTWORK'
      || this.metadata.type === 'PAGE';
  }

  /**
   * Returns whether the detailed position attribute is allowed for the type.
   * @returns {boolean} true if and only if the attribute is allowed
   */
  public canHaveDetailedPosition(): boolean {
    return this.metadata.type === 'ARCHITECTURE' || this.metadata.type === 'BUILDING_ARTWORK';
  }

  /**
   * Returns the label for the detailed position, depending on the type.
   * @returns {string} the label for the detailed position
   */
  public getLabelForDetailedPosition(): string {
    if (!this.canHaveDetailedPosition()) {
      return '';
    }
    switch (this.metadata.type) {
      case 'ARCHITECTURE':
        return 'detailed position within the view';
      case 'BUILDING_ARTWORK':
        return 'position within the building';
    }
  }

  /**
   * Returns whether attachment model is valid, i. e. whether it could be saved.
   * @returns {boolean} true if and only if the model is valid
   */
  public isValid(): boolean {
    return this.isTitleValid() && this.isSourceValid()
        && Attachment.attachmentTypes.includes(this.metadata.type) // the type must be defined
        && this.isSubTypeValid() // if architectural drawing also the type must be defined
        && ((this.metadata.width === undefined && this.metadata.height === undefined && this.metadata.depth === undefined)
              || this.metadata.unit !== undefined); // if width, height or depth is defined, the unit must be also defined
  }

  /**
   * Returns whether the selected subtype is valid for the selected type.
   * @returns {boolean} true if and only if the model is valid.
   */
  public isSubTypeValid(): boolean {
    if (!this.hasSubType()) {
      return true;
    }
    if (this.metadata.type === 'ARCHITECTURAL_DRAWING') {
      return Attachment.attachmentSubTypesForArchitecturalDrawings.includes(this.metadata.subType);
    }
    if (this.metadata.type === 'BUILDING_ARTWORK') {
      return Attachment.attachmentSubTypesForBuildingArtworks.includes(this.metadata.subType);
    }
  }

  /**
   * Returns whether the title is valid.
   * @returns {boolean} true if and only if the title is set to a string unequal to the empty string
   */
  public isTitleValid(): boolean {
    return this.metadata.title !== undefined && this.metadata.title.trim().length > 0;
  }

  /**
   * Returns whether the source is valid.
   * @returns {boolean} true if and only if the source is set to a string unequal to the empty string
   */
  public isSourceValid(): boolean {
    return this.metadata.source !== undefined && this.metadata.source.trim().length > 0;
  }
}

/**
 * Model for the attachment metadata
 */
export class AttachmentMetadata {
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

  /**
   * Constructor for the attachment metadata
   *
   * @param metadataObject the object to construct the metadata from
   */
  constructor(metadataObject: any = null) {
    this.title = '';
    if (metadataObject) {
      if (metadataObject.title) {
        this.title = metadataObject.title;
      }
      if (metadataObject.details) {
        this.details = metadataObject.details;
      }
      if (metadataObject.type) {
        this.type = metadataObject.type;
      }
      if (metadataObject.subType) {
        this.subType = metadataObject.subType;
      }
      if (metadataObject.photographer) {
        this.photographer = metadataObject.photographer;
      }
      if (metadataObject.creator) {
        this.creator = metadataObject.creator;
      }
      if (metadataObject.material) {
        this.material = metadataObject.material;
      }
      if (metadataObject.height) {
        this.height = metadataObject.height;
      }
      if (metadataObject.width) {
        this.width = metadataObject.width;
      }
      if (metadataObject.depth) {
        this.depth = metadataObject.depth;
      }
      if (metadataObject.unit) {
        this.unit = metadataObject.unit;
      }
      if (metadataObject.date) {
        this.date = metadataObject.date;
      }
      if (metadataObject.date2) {
        this.date2 = metadataObject.date2;
      }
      if (metadataObject.source) {
        this.source = metadataObject.source;
      }
      if (metadataObject.copyright) {
        this.copyright = metadataObject.copyright;
      }
      if (metadataObject.location) {
        this.location = metadataObject.location;
      }
      if (metadataObject.signature) {
        this.signature = metadataObject.signature;
      }
      if (metadataObject.page) {
        this.page = metadataObject.page;
      }
      if (metadataObject.pointOfOrigin) {
        this.pointOfOrigin = metadataObject.pointOfOrigin;
      }
      if (metadataObject.placeOfManufacture) {
        this.placeOfManufacture = metadataObject.placeOfManufacture;
      }
      if (metadataObject.detailedPosition) {
        this.detailedPosition = metadataObject.detailedPosition;
      }
    }
  }

  /**
   * Returns an empty metadata object.
   * @returns {AttachmentMetadata} the empty metadata object
   */
  public static emptyAttachmentMetadata() {
    return new AttachmentMetadata();
  }
}
