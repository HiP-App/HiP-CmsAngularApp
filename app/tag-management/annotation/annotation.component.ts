import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { AnnotationTag } from './annotation-tag.model';
import { CanvasComponent } from './canvas/canvas.component';
import { Tag } from '../tag.model';
import { TagService } from '../tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-annotation',
  templateUrl: 'annotation.component.html',
  styles: [`
    .center {
      text-align: center;
      margin-bottom: 10px;
    }
  `]
})
export class AnnotationComponent implements OnInit, OnDestroy {

  @ViewChild('content') content: ElementRef;
  @ViewChild(CanvasComponent) canvas: CanvasComponent;

  @HostListener('window:resize', ['$event']) onResize() {
    this.canvasHeight = this.content.nativeElement.parentElement.offsetHeight;
    this.canvasWidth = this.content.nativeElement.parentElement.offsetWidth;
    for(let tag of this.tagsInDocument) {
      tag.redrawConnection(this.canvas)
    }
  }

  mode = 'annotate';
  mainMenu = new Array<{ label: string, entries: Tag[] }>();
  selectedTag = Tag.emptyTag();
  lastTag: AnnotationTag = null;
  canvasHeight = 0;
  canvasWidth = 0;
  followMouse = false;
  lastElement: HTMLElement = undefined;

  private stylesheet: HTMLStyleElement;
  private tags: Tag[];
  private translatedResponse: string;
  private tagCounter = 0;
  private tagsInDocument: AnnotationTag[] = [];
  private annotateContent: SafeHtml = '';

  constructor(private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.tagService.getAnnotateContent(12)
      .then((result: string) => {
        this.annotateContent = this.sanitizer.bypassSecurityTrustHtml(result);
        setTimeout(() => this.initModel(),5);
      });


    this.tagService.getAllTags()
      .then(
        (response: any) => {
          this.tags = response.sort(this.tagAlphaCompare);
          this.buildMenu();

          // generate a stylesheet for annotations out of tag styles
          this.stylesheet = document.createElement('style');
          for (let tag of this.tags) {
            this.stylesheet.innerHTML += `#text *[data-tag-model-id="${tag.id}"],md-menu *[data-tag-model-id="${tag.id}"] { background-color: ${tag.style} }`;
          }
          this.stylesheet.innerHTML += '#text *[data-tag-model-id] { cursor: pointer }';
          document.head.appendChild(this.stylesheet);
        }
      ).catch(
      (error: any) => this.toasterService.pop('error', this.translate('Error fetching tags'), error)
    );
  }

  initModel() {
    let tags = this.content.nativeElement.getElementsByTagName('span');
    console.log(tags);
    for (let tag of tags) {
      let annotationTag = new AnnotationTag(tag);
      if(annotationTag.isValid()) {
        if (annotationTag.id > this.tagCounter) {
          this.tagCounter = annotationTag.id;
        }
        this.tagsInDocument.push(annotationTag);
      }
    }
    this.initCanvas()
  }

  initCanvas() {
    this.canvasHeight = this.content.nativeElement.parentElement.offsetHeight;
    this.canvasWidth = this.content.nativeElement.parentElement.offsetWidth;

    for(let tag of this.tagsInDocument) {
      if(!isNaN(tag.relatedToId)) {
        if(tag.relatedTo === undefined) {
          let relatedTag = this.tagsInDocument.find((t) => t.id === tag.relatedToId );
          if(relatedTag !== undefined) {
            if(relatedTag.relatedToId !== tag.id) {
              console.error('document is not well formed');
            } else {
              tag.updateRelationTo(relatedTag);
            }
          }
        }
      }
    }
    for(let tag of this.tagsInDocument) {
      tag.drawConnection(this.canvas);
    }
  }

  handleClick(event: any) {
    // TODO: clicking on marked text should present user with various actions (delete, relate, change, etc.)
    if (this.mode === 'annotate') {
      this.updateTag(event);
      this.handleClickAnnotate();
    } else {
      this.handleClickRelation(event);
    }
  }

  handleClickAnnotate() {
    if(this.selectedTag.id === -1) {
      return;
    }
    let selection: any = window.getSelection();
    selection.modify('move', 'forward', 'character');
    selection.modify('move', 'backward', 'word');
    selection.modify('extend', 'forward', 'word');
    let wrapper = this.getWrapper();
    let range = selection.getRangeAt(0);
    let nonWordCharPos = AnnotationComponent.findNonWordCharacters(range.toString());
    if(range.startContainer !== range.endContainer) {
      let offset = range.startContainer.textContent.length-1;
      range.setEnd(range.startContainer, offset );
    }
    while(nonWordCharPos === range.toString().length - 1) {
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
        if(targetTag.relatedTo !== undefined) {
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

  ngOnDestroy() {
    // remove generated stylesheet and its reference when user leaves the component
    if (this.stylesheet) {
      this.stylesheet.parentNode.removeChild(this.stylesheet);
      this.stylesheet = null;
    }
  }

  /**
   * Highlights currently selected button with corresponding tag's style.
   * Returns a collection of styles consumed by ngStyle directive.
   */
  highlightButton(tag: Tag) {
    return {
      'background-color': this.selectedTag.id === tag.id ? tag.style : 'initial'
    };
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
      return;
    }
    let tagId = target.dataset['tagId'];
    let tag = this.tagsInDocument.find((t) => t.id === +tagId);
    console.log(tag);
    if(this.selectedTag.id === tag.id || this.selectedTag.id === -1) {
      target.parentElement.innerHTML = target.parentElement.innerHTML.replace(target.outerHTML, target.innerHTML);
      if(!tag.isRelatedTo()) {
        return;
      }
      tag.undrawConnection(this.canvas);
      tag.removeRelation();
    } else {
      tag.updateTagModel(this.selectedTag.id);
    }
  }

  private buildMenu() {
    Promise.all(this.tags.map(tag => this.tagService.getChildTags(tag.id)))
      .then(
        (response: Tag[][]) => {
          // set childId and parentId for all tags
          for (let i = 0; i < response.length; i++) {
            this.tags[i].childId = response[i].map(tag => tag.id);

            for (let childTag of response[i]) {
              this.tags.find(tag => tag.id === childTag.id).parentId = this.tags[i].id;
            }
          }

          let layers = this.tags.map(tag => tag.layer)
            .filter((layer, index, all) => index === all.indexOf(layer))  // remove duplicates
            .sort();
          for (let layer of layers) {
            let layerTags = this.tags.filter(tag => tag.layer === layer);
            this.mainMenu.push({label: layer, entries: layerTags});
          }
        }
      ).catch(
      (error: any) => this.toasterService.pop('error', this.translate('Error fetching subtags'), error)
    );
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

  /**
   * Utility function to sort tags alphabetically.
   * Lambda syntax is required for proper binding of 'this'.
   */
  private tagAlphaCompare = (a: Tag, b: Tag) => {
    return a.name.localeCompare(b.name, this.translateService.currentLang, {numeric: true});
  };

  private translate(data: string) {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value as string;
      }
    );
    return this.translatedResponse;
  }

  private static findNonWordCharacters(s: string) {
    let nonWordChars = [' ', ',', '.'];
    for(let char of nonWordChars) {
      let pos = s.indexOf(char);
      if(pos !== -1) {
        console.log(pos)
        return pos;
      }
    }
    return -1;
  }
}
