import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { Tag } from '../../tag-management/tag.model';
import { TagService } from '../../tag-management/tag.service';
import { ColorPickerService } from 'angular2-color-picker';

@Component({
  moduleId: module.id, 
  selector: 'hip-edit-tag',
  templateUrl: 'edit-tag.component.html',
  styleUrls: [ 'edit-tag.component.css'],
})
export class EditTagComponent implements OnInit {

  @Input() tag: Tag = Tag.emptyTag();
  private allTags: Tag[] = [];
  private childrenTags: Tag[] = [];
  childTag: Tag = Tag.emptyTag();
  responseHandled: boolean;
  layers: String[] = ["Zeit", "Raum", "Perspektive"];

  constructor(private tagService: TagService,
    private route: ActivatedRoute,
    private toasterService: ToasterService,
    private cpService: ColorPickerService,
    private router: Router) {
  }

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'tags' && this.route.snapshot.url[1].path === 'edit') {
      let id = +this.route.snapshot.params['id'];  
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
      this.router.navigate(['/all-tags']);
    }

    private handleError(error: string) {
      this.toasterService.pop('error', 'Error while saving', error);
    }

    private showToastSuccess(s2: string) {
      this.toasterService.pop('success', 'Success', s2);
    }

  }
