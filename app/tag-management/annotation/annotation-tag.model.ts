import { CanvasComponent } from './canvas/canvas.component';
export class AnnotationTag {
  tagModelId: number;
  id: number;
  relatedTo: AnnotationTag;
  relatedToId: number = 0;
  nativeElement: HTMLElement;
  connectionDrawn = false;
  relationName = '';

  constructor(tag: HTMLElement) {
    this.nativeElement = tag;
    this.tagModelId = +tag.dataset['tagModelId'];
    this.id = +tag.dataset['tagId'];
    this.relatedToId = +tag.dataset['tagRelatedTo'];
  }

  isValid(): boolean {
    return !(isNaN(this.tagModelId) || isNaN(this.id));
  }

  isRelatedTo(tagId: number = -1): boolean {
    if(tagId === -1) {
      return !(this.relatedToId === 0 || isNaN(this.relatedToId));
    }
    return this.relatedToId === tagId;
  }

  updateTagModel(modelId: number) {
    this.tagModelId = modelId;
    this.nativeElement.dataset['tagModelId'] = modelId.toString();
  }

  updateRelationTo(relatedTo: AnnotationTag) {
    if(this.relatedTo === relatedTo) {
      return;
    }
    this.relatedTo = relatedTo;
    this.relatedToId = relatedTo.id;
    this.nativeElement.dataset['tagRelatedTo'] = this.relatedToId.toString();
    this.relatedTo.updateRelationTo(this);
  }

  drawConnection(canvas: CanvasComponent) {
    if(this.connectionDrawn || isNaN(this.relatedToId) || this.relatedToId === 0) {
      return;
    }
    console.log(this.relatedTo);
    console.log(this.relatedToId);
    let name = canvas.connectTags(this.nativeElement, this.relatedTo.nativeElement);
    this.connectionDrawn = true;
    this.relatedTo.connectionDrawn = true;
    this.relationName = name;
    this.relatedTo.relationName = name;
  }

  removeRelation() {
    this.relatedToId = 0;
    if(this.relatedTo.relatedToId !== 0) {
      this.relatedTo.removeRelation();
    }
    this.relatedTo = undefined;
    this.nativeElement.removeAttribute('data-tag-related-to');
    this.relationName = '';
    this.connectionDrawn = false;
  }

  undrawConnection(canvas: CanvasComponent) {
    console.log('undraw ' + this.relationName);
    canvas.deleteLine(this.relationName);
    this.relationName = '';
    try{
      this.relatedTo.connectionDrawn = false;
    } catch (e) {
      // it is possible, that related to does not exists because of removeRelation();
    }
    this.connectionDrawn = false;
  }

  redrawConnection(canvas: CanvasComponent) {
    this.undrawConnection(canvas);
    this.drawConnection(canvas);
  }
}