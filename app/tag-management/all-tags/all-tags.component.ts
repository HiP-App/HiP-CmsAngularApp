import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Tag } from '../../tag-management/tag.model';
import { TagService } from '../../tag-management/tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-all-tags',
  templateUrl: 'all-tags.component.html',
  styleUrls: ['all-tags.component.css']
})
export class AllTagsComponent implements OnInit {
  public layerTree = new Array<{ name: string, tags: Tag[] }>();
  public treeLoaded = false;
  public userCanCreateTags = false;
  public userCanEditTags = false;
  private tags: Tag[];
  private translatedResponse: string;

  constructor(private tagService: TagService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.tagService.getAllTags()
      .then(response => {
        this.tags = response.sort(this.tagAlphaCompare);
        this.buildTagTree();
      })
      .catch(error => this.toasterService.pop('error', this.translate('Error fetching tags'), error));

    this.tagService.currentUserCanCreateTags()
      .then(response => this.userCanCreateTags = response)
      .catch(error => this.toasterService.pop('error', this.translate('Error fetching permissions'), error));

    this.tagService.currentUserCanEditTags()
      .then(response => this.userCanEditTags = response)
      .catch(error => this.toasterService.pop('error', this.translate('Error fetching permissions'), error));
  }

  /**
   * Utility method that returns a subset of all currently loaded and enhanced tags.
   * Used for getting child tags from the nested list.
   */
  public getTagsById(tagIds: number[]): Tag[] {
    if (tagIds && tagIds.length > 0) {
      return this.tags.filter(tag => tagIds.includes(tag.id));
    } else {
      return [];
    }
  }

  /**
   * Updates all tags with parent/child information and builds a tree of tags grouped by layer.
   */
  private buildTagTree(): void {
    Promise.all(this.tags.map(tag => this.tagService.getChildTags(tag.id)))
      .then(response => {
        // set childId and parentId for all tags
        for (let i = 0; i < response.length; i++) {
          this.tags[i].childId = response[i]
            .sort(this.tagAlphaCompare)
            .map(tag => tag.id);

          for (let childTag of this.getTagsById(this.tags[i].childId)) {
            childTag.parentId = this.tags[i].id;
          }
        }

        // extract layers and group root tags by layer
        let layers = this.tags.map(tag => tag.layer.toLowerCase());
        layers = Array.from(new Set(layers)).sort();              // remove duplicates and sort

        for (let layer of layers) {
          let layerTags = this.tags.filter(tag => tag.layer.toLowerCase() === layer && tag.parentId === undefined);
          this.layerTree.push({ name: layer, tags: layerTags });
        }

        this.treeLoaded = true;
      })
      .catch(error => this.toasterService.pop('error', this.translate('Error fetching subtags'), error));
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
