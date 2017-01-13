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

  mode = 'annotate';
  mainMenu: { label: string, entries: Tag[] }[] = [];
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
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.tagService.getAnnotateContent(12)
      .then((result: string) => {
        this.annotateContent = this.sanitizer.bypassSecurityTrustHtml(result);
        setTimeout(() => this.initModel(), 5);
      });


    this.tagService.getAllTags()
      .then(
        (response: any) => {
          this.tags = response.sort((a: Tag, b: Tag) => this.tagAlphaCompare(a, b));
          this.buildMenu();

          // generate a stylesheet for annotations out of tag styles
          this.stylesheet = document.createElement('style');
          for (let tag of this.tags) {
            this.stylesheet.innerHTML += `#text *[data-tag-model-id="${tag.id}"],
            md-menu *[data-tag-model-id="${tag.id}"] { background-color: ${tag.style} }`;
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

  changeRule(tag: Tag) {
    console.log("tag ",tag.id)
    console.log("selected-tag ",this.selectedTag.id)
    console.log("tag-style", tag.style)
    let stylesheet: CSSStyleSheet = <CSSStyleSheet>this.stylesheet.sheet;
    let ruleLength: number = (<CSSStyleSheet>this.stylesheet.sheet).cssRules.length;
    for(let i = 0; i < ruleLength; i++) {
      console.log("Inside For")
      if((<CSSStyleRule>(<CSSStyleSheet>this.stylesheet.sheet).cssRules[i]).
        selectorText.indexOf(`#text `+`[data-tag-id="${this.selectedTag.id}"]`) >= 0
        && this.selectedTag.id === tag.id) {
        if((<CSSStyleRule>(<CSSStyleSheet>this.stylesheet.sheet).cssRules[i]).style.backgroundColor !== "initial"){

          console.log("Color is initial for tag-id:"+this.selectedTag.id);
          (<CSSStyleRule>(<CSSStyleSheet>this.stylesheet.sheet).cssRules[i]).style.backgroundColor = "initial";
          console.log((<CSSStyleRule>(<CSSStyleSheet>this.stylesheet.sheet).cssRules[i]).selectorText)
        }
        break;
      }
      else if((<CSSStyleRule>(<CSSStyleSheet>this.stylesheet.sheet).cssRules[i]).selectorText.indexOf(`#text `+`[data-tag-id="${tag.id}"]`) >= 0) {
        console.log("Different selectorText:"+tag.style);
        (<CSSStyleRule>(<CSSStyleSheet>this.stylesheet.sheet).cssRules[i]).style.backgroundColor = tag.style;
      }      
    }
    console.log(<CSSStyleSheet>this.stylesheet.sheet)
  }

  /**
   * Sets currently selected tag or turns it off if selected twice.
   */
  switchTag(tag: Tag) {
    this.changeRule(tag);
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
   */
  private tagAlphaCompare(a: Tag, b: Tag) {
    return a.name.localeCompare(b.name, this.translateService.currentLang, {numeric: true});
  }

  private translate(data: string) {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value as string;
      }
    );
    return this.translatedResponse;
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