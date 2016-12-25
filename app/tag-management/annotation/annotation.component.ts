import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Tag } from '../tag.model';
import { TagService } from '../tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-annotation',
  templateUrl: 'annotation.component.html'
})
export class AnnotationComponent implements OnInit, OnDestroy {
  mainMenu = new Array<{ label: string, entries: Tag[] }>();
  selectedTag = Tag.emptyTag();
  private stylesheet: HTMLStyleElement;
  private tags: Tag[];
  private translatedResponse: string;

  constructor(private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService) { }

  ngOnInit() {
    this.tagService.getAllTags()
      .then(response => {
        this.tags = response.sort(this.tagAlphaCompare);
        this.buildMenu();

        // generate a stylesheet for annotations out of tag styles
        this.stylesheet = document.createElement('style');
        for (let tag of this.tags) {
          this.stylesheet.innerHTML += `#text *[data-tag-id="${tag.id}"] { background-color: ${tag.style} }`;
        }
        this.stylesheet.innerHTML += '#text *[data-tag-id] { cursor: pointer }';
        document.head.appendChild(this.stylesheet);
      })
      .catch(error => this.toasterService.pop('error', this.translate('Error fetching tags'), error));

    // set up a listener to remove an annotation on click
    // TODO: clicking on marked text should present user with various actions (delete, relate, change, etc.)
    document.getElementById('text').addEventListener('click', event => {
      if (!document.getSelection().isCollapsed) { return; }

      let target = event.target as HTMLElement;
      if ('tagId' in target.dataset) {
        target.parentElement.innerHTML = target.parentElement.innerHTML.replace(target.outerHTML, target.innerHTML);
      }
    });
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
    let selection = document.getSelection();
    if (this.selectedTag.id === -1 || selection.toString().trim().length === 0) { return; }

    let range = selection.getRangeAt(0);
    let wrapper = this.getWrapper();

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

  private buildMenu() {
    Promise.all(this.tags.map(tag => this.tagService.getChildTags(tag.id)))
      .then(response => {
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
          this.mainMenu.push({ label: layer, entries: layerTags });
        }
      })
      .catch(error => this.toasterService.pop('error', this.translate('Error fetching subtags'), error));
  }

  /**
   * Returns an HTML element that will wrap current selection.
   */
  private getWrapper() {
    let wrapper = document.createElement('span');
    let data = wrapper.dataset as any;
        data.tagId = this.selectedTag.id;
    return wrapper;
  }

  /**
   * Utility function to sort tags alphabetically.
   * Lambda syntax is required for proper binding of 'this'.
   */
  private tagAlphaCompare = (a: Tag, b: Tag) => {
    return a.name.localeCompare(b.name, this.translateService.currentLang, { numeric: true });
  }

  private translate(data: string) {
    this.translateService.get(data).subscribe(value => {
      this.translatedResponse = value as string;
    });
    return this.translatedResponse;
  }
}
