import {
  Component, OnInit, OnDestroy, Input, Output, EventEmitter
} from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Tag } from '../../tag.model';
import { TagService } from '../../tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-tag-menu',
  templateUrl: 'tag-menu.component.html',
  styleUrls: [ 'tag-menu.component.css' ]
})
export class TagMenuComponent implements OnInit, OnDestroy {
  @Input() selectedTag = Tag.emptyTag();
  @Output() selectedTagChange = new EventEmitter<Tag>();
  parentTags: Tag[] = [];
  mainMenu: { label: string, entries: Tag[] }[] = [];

  private stylesheet: HTMLStyleElement;
  private tags: Tag[];
  private translatedResponse: string;

  constructor(private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.tagService.getAllTags()
      .then(
        (response: any) => {
          this.tags = response;
          this.buildMenu();

          // generate a stylesheet for annotations out of tag styles
          this.stylesheet = document.createElement('style');
          for (let tag of this.tags) {
            this.stylesheet.innerHTML +=
              `#text *[data-tag-model-id="${tag.id}"] { 
                 background-color: ${tag.style};
               }
               
              md-menu *[data-tag-model-id="${tag.id}"] {
                border: 1px solid ${tag.style};
              }
              
              button [data-tag-model-id="${tag.id}"] {
                background: ${tag.style};
              }
          `;
          }
          this.stylesheet.innerHTML += '#text *[data-tag-model-id] { cursor: pointer }';
          document.head.appendChild(this.stylesheet);
        }
      ).catch(
      (error: any) => this.toasterService.pop('error', this.translate('Error fetching tags'), error)
    );
  }

  ngOnDestroy() {
    // remove generated stylesheet and its reference when user leaves the component
    if (this.stylesheet) {
      this.stylesheet.parentNode.removeChild(this.stylesheet);
      this.stylesheet = null;
    }
  }


  changeRule(tag: Tag) {
    let ruleLength: number = (<CSSStyleSheet>this.stylesheet.sheet).cssRules.length;
    for (let i = 0; i < ruleLength; i++) {
      let styleRule = <CSSStyleRule>(<CSSStyleSheet>this.stylesheet.sheet).cssRules[i];
      if (styleRule.selectorText.indexOf(`#text ` + `[data-tag-model-id="${tag.id}"]`) >= 0) {
        styleRule.style.backgroundColor = styleRule.style.backgroundColor !== 'initial' ? 'initial' : tag.style;
      }
    }
    tag.toggleVisibility();
  }

  /**
   * Sets currently selected tag or turns it off if selected twice.
   */
  switchTag(tag: Tag) {
    console.log('switch Tag');
    console.log(tag);
    this.selectedTag = this.selectedTag.id === tag.id ? Tag.emptyTag() : tag;
    this.selectedTagChange.emit(this.selectedTag);
  }

  private buildMenu() {
    this.tagService.getAllTags(true)
      .then(
        (response: Tag[]) => {
          this.parentTags = response;
          let layers = this.parentTags.map(tag => tag.layer)
            .filter((layer, index, all) => index === all.indexOf(layer))  // remove duplicates
            .sort();
          console.log(layers);
          console.log(this.parentTags);
          for (let layer of layers) {
            let layerTags = this.parentTags.filter(tag => tag.layer === layer);
            console.log(layerTags);
            this.mainMenu.push({label: layer, entries: layerTags});
          }
        }
      );

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
        }
      ).catch(
      (error: any) => this.toasterService.pop('error', this.translate('Error fetching subtags'), error)
    );
  }

  private translate(data: string) {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value as string;
      }
    );
    return this.translatedResponse;
  }

}
