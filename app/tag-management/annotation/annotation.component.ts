import {
  Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy, AfterViewChecked
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from 'ng2-translate';

import { AnnotationTag } from './annotation-tag.model';
import { CanvasComponent } from './canvas/canvas.component';
import { Tag } from '../tag.model';
import { TagService } from '../tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-annotation',
  templateUrl: 'annotation.component.html',
  styleUrls: [ 'annotation.component.css' ]
})
export class AnnotationComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('content') content: ElementRef;
  @ViewChild(CanvasComponent) canvas: CanvasComponent;

  mode = 'annotate';
  selectedTag = Tag.emptyTag();
  lastTag: AnnotationTag = null;
  canvasHeight = 0;
  canvasWidth = 0;
  followMouse = false;
  lastElement: HTMLElement = undefined;
  isToggleVisible = true;
  stylesheet = document.createElement('style');

  private tagCounter = 0;
  private tagsInDocument: AnnotationTag[] = [];
  private annotateContent: SafeHtml = '';
  private tempContentWidth = 0;

  private static findNonWordCharacters(s: string) {
    let nonWordChars = [' ', ',', '.'];
    for (let char of nonWordChars) {
      let pos = s.indexOf(char);
      if (pos !== -1) {
        return pos;
      }
    }
    return -1;
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.canvasHeight = this.content.nativeElement.parentElement.offsetHeight;
    this.canvasWidth = this.content.nativeElement.parentElement.offsetWidth;
    for (let tag of this.tagsInDocument) {
      tag.redrawConnection(this.canvas);
    }
  }

  constructor(private tagService: TagService,
              private sanitizer: DomSanitizer) {
  }


  ngOnInit() {
    document.head.appendChild(this.stylesheet);
    this.tagService.getAnnotateContent(12)
      .then((result: string) => {
        this.annotateContent = this.sanitizer.bypassSecurityTrustHtml(result);
        setTimeout(() => this.initModel(), 5);
      });
  }

  ngAfterViewChecked() {
    if (this.tempContentWidth !== this.content.nativeElement.offsetWidth) {
      this.tempContentWidth = this.content.nativeElement.offsetWidth;
      setTimeout(() => this.onResize());
    }
  }

  ngOnDestroy() {
    // remove generated stylesheet and its reference when user leaves the component
    if (this.stylesheet) {
      this.stylesheet.parentNode.removeChild(this.stylesheet);
      this.stylesheet = null;
    }
  }

  initModel() {
    let tags = this.content.nativeElement.getElementsByTagName('span');
    for (let tag of tags) {
      let annotationTag = new AnnotationTag(tag);
      if (annotationTag.isValid()) {
        if (annotationTag.id > this.tagCounter) {
          this.tagCounter = annotationTag.id;
        }
        this.tagsInDocument.push(annotationTag);
      }
    }
    this.initCanvas();
  }

  initCanvas() {
    this.canvasHeight = this.content.nativeElement.parentElement.offsetHeight;
    this.canvasWidth = this.content.nativeElement.parentElement.offsetWidth;

    for (let tag of this.tagsInDocument) {
      if (!isNaN(tag.relatedToId)) {
        if (tag.relatedTo === undefined) {
          let relatedTag = this.tagsInDocument.find((t) => t.id === tag.relatedToId );
          if (relatedTag !== undefined) {
            if (relatedTag.relatedToId !== tag.id) {
              console.error('document is not well formed');
            } else {
              tag.updateRelationTo(relatedTag);
            }
          }
        }
      }
    }
    for (let tag of this.tagsInDocument) {
      tag.drawConnection(this.canvas);
    }
  }

  handleClick(event: any) {
    // TODO: clicking on marked text should present user with various actions (delete, relate, change, etc.)
    if (this.mode === 'annotate') {
      let isTagUpdated = this.updateTag(event);
      if (!isTagUpdated) {
        this.handleClickAnnotate();
      }
    } else {
      this.handleClickRelation(event);
    }
  }

  handleClickAnnotate() {
    if (this.selectedTag.id === -1) {
      return;
    }
    let selection: any = window.getSelection();
    selection.modify('move', 'forward', 'character');
    selection.modify('move', 'backward', 'word');
    selection.modify('extend', 'forward', 'word');
    let wrapper = this.getWrapper();
    let range = selection.getRangeAt(0);
    let nonWordCharPos = AnnotationComponent.findNonWordCharacters(range.toString());
    if (range.startContainer !== range.endContainer) {
      let offset = range.startContainer.textContent.length - 1;
      range.setEnd(range.startContainer, offset );
    }
    while (nonWordCharPos === range.toString().length - 1) {
      range.setEnd(range.startContainer, range.startOffset + range.toString().length - 1 );
      nonWordCharPos = AnnotationComponent.findNonWordCharacters(range.toString());
    }
    range.surroundContents(wrapper);
    this.tagsInDocument.push(new AnnotationTag(wrapper));
    selection.modify('move', 'forward', 'character');
  }

  handleClickRelation(event: any) {
    let target = event.target as HTMLElement;
    if ('tagModelId' in target.dataset) {
      let targetTag = this.tagsInDocument.find((t) => t.id === +target.dataset['tagId']);
      if (targetTag !== undefined) {
        if (targetTag.relatedTo !== undefined) {
          targetTag.undrawConnection(this.canvas);
          targetTag.removeRelation();
          return;
        }
        if (this.lastTag !== null) {
          targetTag.updateRelationTo(this.lastTag);
          targetTag.drawConnection(this.canvas);
          this.lastTag = null;
          this.followMouse = false;
          this.lastElement = undefined;
        } else {
          this.lastTag = targetTag;
          this.followMouse = true;
          this.lastElement = target;
        }
      }
    }
  }

  /**
   * Sets currently selected tag or turns it off if selected twice.
   */
  switchTag(tag: Tag) {
    this.selectedTag = this.selectedTag.id === tag.id ? Tag.emptyTag() : tag;
  }

  updateTag(event: any) {
    let target = event.target;
    if (!('tagId' in target.dataset)) {
      return false;
    }
    let tagId = target.dataset['tagId'];
    let tag = this.tagsInDocument.find((t) => t.id === +tagId);
    if (this.selectedTag.id === tag.tagModelId || this.selectedTag.id === -1) {
      this.deleteTag(tag);
    } else {
      tag.updateTagModel(this.selectedTag.id);
    }
    return true;
  }

  /**
   * Returns an HTML element that will wrap current selection.
   */
  private getWrapper() {
    let wrapper = document.createElement('span');
    wrapper.dataset['tagModelId'] = this.selectedTag.id.toString();
    wrapper.dataset['tagId'] = (++this.tagCounter).toString();
    return wrapper;
  }

  private deleteTag(tag: AnnotationTag) {
    let parentElement = tag.nativeElement.parentElement;
    parentElement.innerHTML = parentElement.innerHTML.replace(tag.nativeElement.outerHTML, tag.nativeElement.innerHTML);
    if (tag.isRelatedTo()) {
      tag.undrawConnection(this.canvas);
      tag.removeRelation();
    }
    let index = this.tagsInDocument.indexOf(tag);
    this.tagsInDocument.splice(index, 1);
    // reset the native Element of each tag, since it got removed by replacing the innerHTML
    let tagsToReset: NodeListOf<HTMLElement> = parentElement.getElementsByTagName('span');
    for (let i = 0; i < tagsToReset.length; i++) {
      if ('tagId' in tagsToReset[i].dataset) {
        let foundTag = this.tagsInDocument.find(
          (t: AnnotationTag) => t.id === +tagsToReset[i].dataset['tagId']
        );
        if (foundTag !== undefined) {
          foundTag.nativeElement = tagsToReset[i];
        }
      }
    }
  }
}
