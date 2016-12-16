import { Component} from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';

import { Tag } from '../../tag-management/tag.model';
import { TagService } from '../../tag-management/tag.service';

@Component({
  selector: 'hip-delete-tag',
  templateUrl: '../app/tag-management/delete-tag/delete-tag.component.html',
})

export class DeleteTagComponent {
  tag: Tag = Tag.emptyTag();
  private responseHandled: boolean;

  constructor(private tagService: TagService, private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService) {
  }

  ngOnInit(){
    if (this.route.snapshot.url[0].path === 'tags' && this.route.snapshot.url[1].path === 'delete') {
      let id = +this.route.snapshot.params['id']; 
      this.responseHandled = false;
      this.tagService.getTag(id).then(
        (response: any) => {
          this.tag = <Tag> response;
        }
        ).catch(
        (error: any) => this.toasterService.pop('error', 'Error fetching tag', error)
        );
      }}


      deleteTag() {
        this.tagService.deleteTag(this.tag.id).then(
          (response: any) => this.handleResponseDelete(response)
          ).catch(
          (error: any) => this.handleError(error)
          );
        }

        private handleResponseDelete(response: any) {
          this.toasterService.pop('success', 'Success', 'Tag "' + this.tag.name + '" deleted');
          this.responseHandled = true;
        }

        private handleError(error: string) {
          this.toasterService.pop('error', 'Error while deleting', error);
        }
      }
