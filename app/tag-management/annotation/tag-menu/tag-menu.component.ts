import {
  Component, OnInit, Input, Output, EventEmitter
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
export class TagMenuComponent implements OnInit {
  @Input() selectedTag = Tag.emptyTag();
  @Input() stylesheet: HTMLStyleElement;
  @Output() selectedTagChange = new EventEmitter<Tag>();

  parentTags: Tag[] = [];
  mainMenu: { label: string, entries: Tag[] }[] = [];

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
          this.writeStyle();
        }
      ).catch(
      (error: any) => this.toasterService.pop('error', this.translate('Error fetching tags'), error)
    );
  }

  writeStyle() {
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
