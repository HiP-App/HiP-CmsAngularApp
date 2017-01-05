import { Component, OnInit, OnDestroy, ViewChild, ElementRef, SecurityContext } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Tag } from '../tag.model';
import { TagService } from '../tag.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CanvasComponent } from './canvas/canvas.component';
import { AnnotationTag } from './annotation-tag.model';

@Component({
  moduleId: module.id,
  selector: 'hip-annotation',
  templateUrl: 'annotation.component.html'
})
export class AnnotationComponent implements OnInit, OnDestroy {

  @ViewChild('content') content: ElementRef;
  @ViewChild(CanvasComponent) canvas: CanvasComponent;

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
            this.stylesheet.innerHTML += `#text *[data-tag-id="${tag.id}"],md-menu *[data-tag-id="${tag.id}"] { background-color: ${tag.style} }`;
          }
          this.stylesheet.innerHTML += '#text *[data-tag-id] { cursor: pointer }';
          document.head.appendChild(this.stylesheet);
        }
      ).catch(
      (error: any) => this.toasterService.pop('error', this.translate('Error fetching tags'), error)
    );

    // set up a listener to remove an annotation on click
    // TODO: clicking on marked text should present user with various actions (delete, relate, change, etc.)
    // this.content.nativeElement.addEventListener('click', (event: any) => {
    //   if (!document.getSelection().isCollapsed) { return; }
    //   this.handleClickRelation(event);
    // });
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
    if (this.mode === 'annotate') {
      this.updateTag(event);
      this.handleClickAnnotate(event);
    } else {
      this.handleClickRelation(event);
    }

  }

  handleClickAnnotate(event: any) {
    console.log(event);
    let selection: any = window.getSelection();
    selection.modify('move', 'forward', 'character');
    selection.modify('move', 'backward', 'word');
    selection.modify('extend', 'forward', 'word');
    console.log('_' + selection.toString() + '_');
    let wrapper = this.getWrapper();
    selection.getRangeAt(0).surroundContents(wrapper);
    this.tagsInDocument.push(new AnnotationTag(wrapper));
    selection.modify('move', 'forward', 'character');
  }

  handleClickRelation(event: any) {
    let target = event.target as HTMLElement;
    if ('tagId' in target.dataset) {
      let targetTag = this.tagsInDocument.find((t) => t.id === +target.getAttribute('tag-id'));
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
   * Handles and validates text selections made by the user and creates annotations out of them.
   */
  handleSelect() {
    if (this.mode === 'annotate') {
      this.handleSelectAnnotate();
    } else {
      this.handleSelectRelation()
    }
  }

  private handleSelectRelation() {
    // nothing for now
  }

  private handleSelectAnnotate() {
    let selection = document.getSelection();
    if (this.selectedTag.id === -1 || selection.toString().trim().length === 0) {
      return;
    }
    let range = selection.getRangeAt(0);
    let wrapper = this.getWrapper();
    console.log(wrapper);

    // prevent invalid selections
    if (!range.startContainer.isSameNode(range.endContainer)) {
      let startIsSiblingOfEnd = range.endContainer.parentNode.contains(range.startContainer);
      let endIsSiblingOfStart = range.startContainer.parentNode.contains(range.endContainer);

      if (startIsSiblingOfEnd && endIsSiblingOfStart) {
        // selection fully covers another tag -> disallow
        range.collapse(false);
      } else if (startIsSiblingOfEnd) {
        // selection starts inside another tag -> cut off start overlap
        range.setStartAfter(range.startContainer.parentNode);
      } else if (endIsSiblingOfStart) {
        // selection ends inside another tag -> cut off end overlap
        range.setEndBefore(range.endContainer.parentNode);
      } else {
        // selection's endpoints are inside different tags -> cut off both overlaps
        range.setStartAfter(range.startContainer.parentNode);
        range.setEndBefore(range.endContainer.parentNode);
      }
    } else {
      if ('tagId' in range.endContainer.parentElement.dataset) {
        // selection is fully inside another annotation -> disallow
        range.collapse(false);
      }
      // wrap selection if not empty, then deselect
      try {
        if (range.toString().trim().length > 0) {
          range.surroundContents(wrapper);
          this.tagsInDocument.push(new AnnotationTag(wrapper));
        }
      } catch (error) {
        console.log(error);
      } finally {
        range.detach();
        selection.removeAllRanges();
      }
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
    if(this.selectedTag.id === -1) {
      // ignore event
      return;
    }
    console.log(event);
    let tagId = event.target.getAttribute('tag-id');
    if(tagId === null) {
      return;
    }
    let tag = this.tagsInDocument.find((t) => t.id === +tagId);
    tag.updateTagModel(this.selectedTag.id);
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
    let html = `<span data-tag-id="${this.selectedTag.id}" tag-id="${++this.tagCounter}"></span>`;
    let wrapper = document.createElement('span');
    wrapper.innerHTML = html;
    return wrapper.getElementsByTagName('span')[0];
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

}
