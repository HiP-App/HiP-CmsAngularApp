import {
  Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy, AfterViewChecked
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { AnnotationTag } from './annotation-tag.model';
import { CanvasComponent } from './canvas/canvas.component';
import { Tag } from '../tag.model';
import { TagService } from '../tag.service';
import { TopicService } from '../../topics/shared/topic.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
  private topicId: number;
  private isContentSaved = false;

  private static findNonWordCharacters(s: string, fromEnd = false) {
    let nonWordChars = ['?', '!', ',', '.', ' '];
    let pos = -1;
    for (let char of nonWordChars) {
      let posTemp;
      if (fromEnd) {
        posTemp = s.lastIndexOf(char);
      } else {
        posTemp = s.indexOf(char);
      }
      if (posTemp !== -1) {
        if (pos === -1) {
          pos = posTemp;
        }
        if (fromEnd) {
          pos = pos > posTemp ? pos : posTemp;
        } else {
          pos = pos < posTemp ? pos : posTemp;
        }
      }
    }
    return pos;
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.canvasHeight = this.content.nativeElement.parentElement.offsetHeight;
    this.canvasWidth = this.content.nativeElement.parentElement.offsetWidth;
    for (let tag of this.tagsInDocument) {
      tag.redrawConnection(this.canvas);
    }
  }

  constructor(private tagService: TagService,
              private topicService: TopicService,
              private route: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer,
              private spinnerService: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinnerService.show();
    this.topicId = +this.route.snapshot.params['id'];

    document.head.appendChild(this.stylesheet);

    this.topicService.getTopic(this.topicId).then(
      () => {
        this.spinnerService.hide();
      })
      .catch(
        () => {
          this.router.navigate(['/error']);
          this.spinnerService.hide();
      });

    this.spinnerService.show();
    this.tagService.getAnnotateContent(this.topicId)
      .then(
        (result: { content: string }) => {
          this.spinnerService.hide();
          this.annotateContent = this.sanitizer.bypassSecurityTrustHtml(result.content);
          setTimeout(() => this.initModel(), 5);
        }
      ).catch(
        () => {
          this.spinnerService.hide();
        }
      );;
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
    this.spinnerService.hide();
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
    this.isContentSaved = false;
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
    if (selection.toString().length === 0) {
      selection.modify('move', 'forward', 'character');
      selection.modify('move', 'backward', 'word');
      selection.modify('extend', 'forward', 'word');
    }
    let wrapper = this.getWrapper();
    let range = selection.getRangeAt(0);
    let nonWordCharPos = AnnotationComponent.findNonWordCharacters(range.toString());
    if (range.startContainer !== range.endContainer) {
      let offset = range.startContainer.textContent.length - 1;
      range.setEnd(range.startContainer, offset );
    }
    // Extend start of range
    while (nonWordCharPos === range.toString().length - 1) {
      range.setEnd(range.startContainer, range.startOffset + range.toString().length - 1 );
      nonWordCharPos = AnnotationComponent.findNonWordCharacters(range.toString());
    }
    while (nonWordCharPos !== 0 && range.startOffset > 0) {
      range.setStart(range.startContainer, range.startOffset - 1);
      nonWordCharPos = AnnotationComponent.findNonWordCharacters(range.toString());
    }
    if (nonWordCharPos !== -1 && !((range.startOffset === 0 || range.startOffset === 1) && nonWordCharPos > 0)) {
      range.setStart(range.startContainer, range.startOffset + 1);
    }

    // Extend end of range
    nonWordCharPos = AnnotationComponent.findNonWordCharacters(range.toString(), true);
    while (!(nonWordCharPos === range.toString().length - 1) && range.endOffset < range.startContainer.length) {
      range.setEnd(range.startContainer, range.startOffset + range.toString().length + 1);
      nonWordCharPos = AnnotationComponent.findNonWordCharacters(range.toString(), true);
    }
    if (nonWordCharPos > 0) {
      range.setEnd(range.startContainer, range.startOffset + range.toString().length - 1);
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

  onClickSave() {
    let htmlContent = this.content.nativeElement.innerHTML;
    this.tagService.saveAnnotatedDocument(this.topicId, htmlContent)
      .then(response => this.isContentSaved = true);
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
