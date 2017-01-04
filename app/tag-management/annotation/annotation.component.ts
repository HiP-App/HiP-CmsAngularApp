import { Component, OnInit, OnDestroy, ViewChild, ElementRef, SecurityContext } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Tag } from '../tag.model';
import { TagService } from '../tag.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'hip-annotation',
  templateUrl: 'annotation.component.html'
})
export class AnnotationComponent implements OnInit, OnDestroy {

  @ViewChild('content') content: ElementRef;
  @ViewChild('svg') svg: ElementRef;

  mode = 'annotate';
  mainMenu = new Array<{ label: string, entries: Tag[] }>();
  selectedTag = Tag.emptyTag();
  lastTag: HTMLElement = null;

  private stylesheet: HTMLStyleElement;
  private tags: Tag[];
  private translatedResponse: string;
  private tagCounter = 0;
  private tagsInDocument: HTMLElement[] = [];
  private annotateContent: SafeHtml = '';

  constructor(private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService,
              private sanitizer: DomSanitizer) {
  }

  updateCanvasDimensions() {
    let canvasHeight = this.svg.nativeElement.parentElement.offsetHeight;
    let canvasWidth = this.svg.nativeElement.parentElement.offsetWidth;
    this.svg.nativeElement.setAttribute('width', canvasWidth);
    this.svg.nativeElement.setAttribute('height', canvasHeight);
  }

  ngOnInit() {
    this.tagService.getAnnotateContent(12)
      .then((result: string) => {
        this.annotateContent = this.sanitizer.bypassSecurityTrustHtml(result);
        // timeout to give angular time to render the Content
        // without the height will be set to 0
        setTimeout(() => this.updateCanvasDimensions(),5);
      });

    let tags = this.content.nativeElement.getElementsByTagName('span');
    for (let tag of tags) {
      let id = +tag.getAttribute('tag-id');
      if (id > this.tagCounter) {
        this.tagCounter = id;
      }
      this.tagsInDocument.push(tag);
    }

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

  handleClick(event: any) {
    if (this.mode === 'annotate') {
      //nothing for now
    } else {
      this.handleClickRelation(event);
    }

  }

  handleClickRelation(event: any) {
    let target = event.target as HTMLElement;
    if ('tagId' in target.dataset) {
      let tagId = target.getAttribute('tag-id');
      if (tagId !== undefined) {
        if (this.lastTag !== null) {
          this.lastTag.setAttribute('tag-related-to', tagId);
          target.setAttribute('tag-related-to', this.lastTag.getAttribute('tag-id'));
          this.connectTags(this.lastTag, target, '#FF0000', 0.45);
          this.lastTag = null
        } else {
          this.lastTag = target;
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

  updateTag(event: Event) {
    for (let tag of this.tagsInDocument) {
      if (+tag.getAttribute('tag-id') === +event) {
        tag.setAttribute('data-tag-id', this.selectedTag.id.toString());
      }
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

  getSVG() {
    return this.svg.nativeElement;
  }

  static findAbsolutePosition(htmlElement: HTMLElement) {
    let x = htmlElement.offsetLeft;
    let y = htmlElement.offsetTop;
    for (let x = 0, y = 0, el = htmlElement;
         el != null;
         el = el.offsetParent as HTMLElement) {
      x += el.offsetLeft;
      y += el.offsetTop;
    }
    console.log('absolutePosition: ' + x + ', ' + y);
    return {
      "x": x,
      "y": y
    };
  }

  connectTags(first: HTMLElement, secound: HTMLElement, color: string, tension: number) {

    const leftPos = AnnotationComponent.findAbsolutePosition(first);
    let x1 = leftPos.x;
    let y1 = leftPos.y;
    x1 += first.offsetWidth;
    y1 += (first.offsetHeight / 2);

    const rightPos = AnnotationComponent.findAbsolutePosition(secound);
    let x2 = rightPos.x;
    let y2 = rightPos.y;
    y2 += (secound.offsetHeight / 2);

    this.drawCurvedLine(x1, y1, x2, y2, color, tension);
  }

  drawCurvedLine(x1: number, y1: number, x2: number, y2: number, color: string, tension: number) {
    let svg = this.getSVG();
    let shape = document.createElementNS("http://www.w3.org/2000/svg",
      "path");
    {
      const delta = (x2 - x1) * tension;
      const hx1 = x1 + delta;
      const hy1 = y1;
      const hx2 = x2 - delta;
      const hy2 = y2;
      const path = "M " + x1 + " " + y1 +
        " C " + hx1 + " " + hy1
        + " " + hx2 + " " + hy2
        + " " + x2 + " " + y2;
      shape.setAttributeNS(null, "d", path);
      shape.setAttributeNS(null, "fill", "none");
      shape.setAttributeNS(null, "stroke", color);
      svg.appendChild(shape);
    }
  }
}
