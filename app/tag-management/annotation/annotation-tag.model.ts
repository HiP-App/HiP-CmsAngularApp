import { CanvasComponent } from './canvas/canvas.component';
export class AnnotationTag {
  tagModelId: number;
  id: number;
  relatedTo: AnnotationTag;
  relatedToId: number;
  nativeElement: HTMLElement;
  connectionDrawn = false;
  relationName = '';

  constructor(tag: HTMLElement) {
    this.nativeElement = tag;
    this.tagModelId = +tag.getAttribute('data-tag-id');
    this.id = +tag.getAttribute('tag-id');
    this.relatedToId = +tag.getAttribute('tag-related-to');
  }

  isValid():boolean {
    return !(isNaN(this.tagModelId) || isNaN(this.id));
  }

  updateTagModel(modelId: number) {
    this.tagModelId = modelId;
    this.nativeElement.setAttribute('data-tag-id', modelId.toString());
  }

  updateRelationTo(relatedTo: AnnotationTag) {
    console.log('updateRelationTo');
    if(this.relatedTo === relatedTo) {
      return;
    }
    this.relatedTo = relatedTo;
    this.relatedToId = relatedTo.id;
    this.nativeElement.setAttribute('tag-related-to', this.relatedToId.toString());
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
    console.log('removeRelation');
    this.relatedToId = 0;
    if(this.relatedTo.relatedToId !== 0) {
      this.relatedTo.removeRelation();
    }
    this.relatedTo = undefined;
    this.nativeElement.removeAttribute('tag-related-to');
    this.relationName = '';
    this.connectionDrawn = false;
  }

  undrawConnection(canvas: CanvasComponent) {
    canvas.deleteLine(this.relationName);
    this.relationName = '';
  }
}