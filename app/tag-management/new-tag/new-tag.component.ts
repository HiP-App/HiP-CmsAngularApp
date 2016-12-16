import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

import { Tag } from '../../tag-management/tag.model';
import { TagService } from '../../tag-management/tag.service';
import { ColorPickerService } from 'angular2-color-picker';

@Component({
  selector: 'hip-new-tag',
  templateUrl: './app/tag-management/new-tag/new-tag.component.html',
  styleUrls: ['./app/tag-management/new-tag/new-tag.component.css'],
})

export class NewTagComponent implements OnInit{
  tag: Tag = Tag.emptyTag();
  responseHandled: boolean;
  allTags: Tag[] = [];
  layers: String[] = ["Zeit", "Raum", "Perspektive"];
 
  constructor(private tagService: TagService,
    private toasterService: ToasterService,
    private cpService: ColorPickerService) {
  }

  ngOnInit(){
    this.responseHandled = false;
  }

  public addTag() {
    this.tagService.createTag(this.tag)
    .then((response: any) => {
      this.showToastSuccess('Tag "' + this.tag.name + '" saved');
      this.responseHandled = true;
    })
    .catch((error: any) => {
      try {
        this.handleError(error)
      } catch (e) {
      }
    });
  }

  selectLayer(selectedLayer: string) {
    this.tag.layer = selectedLayer;
  }

  private handleError(error: string) {
    this.toasterService.pop('error', 'Error while saving', error);
  }

  private showToastSuccess(s2: string) {
    this.toasterService.pop('success', 'Success', s2);
  }
}
