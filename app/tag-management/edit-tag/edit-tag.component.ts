import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { Tag } from '../../tag-management/tag.model';
import { TagService } from '../../tag-management/tag.service';
import { ColorPickerService } from 'angular2-color-picker';

@Component({
  selector: 'hip-edit-tag',
  templateUrl: '../app/tag-management/edit-tag/edit-tag.component.html',
  styleUrls: [ '../app/tag-management/edit-tag/edit-tag.component.css'],
})
export class EditTagComponent implements OnInit{

  @Input() tag: Tag = Tag.emptyTag();
  private allTags: Tag[] = [];
  private childrenTags: Tag[] = [];
  childTag: Tag = Tag.emptyTag();
  responseHandled: boolean;
  layers: String[] = ["Zeit", "Raum", "Perspektive"];

  constructor(private tagService: TagService,
    private route: ActivatedRoute,
    private toasterService: ToasterService,
    private cpService: ColorPickerService) {
  }

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'tags' && this.route.snapshot.url[1].path === 'edit') {
      let id = +this.route.snapshot.params['id']; // (+) converts string 'id' to a number  
      this.responseHandled = false;
      this.tagService.getTag(id).then(
        (response: any) => {
          this.tag = <Tag> response;
        }
        ).catch(
        (error: any) => this.toasterService.pop('error', 'Error fetching tag', error)
        );
      }
    }

    public editTag() {
      this.tagService.updateTag(this.tag)
      .then(
        (response: any) => this.handleResponseEdit(response)
        )
      .catch(
        (error: any) => this.handleError(error)
        );
    }


    selectLayer(selectedLayer: string) {
      this.tag.layer = selectedLayer;
    }

    private handleResponseEdit(response: any) {
      this.showToastSuccess('Tag "' + this.tag.name + '" updated');
      this.responseHandled = true;
      console.log(response);
    }

    private handleError(error: string) {
      this.toasterService.pop('error', 'Error while saving', error);
    }

    private showToastSuccess(s2: string) {
      this.toasterService.pop('success', 'Success', s2);
    }

  }
