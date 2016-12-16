  import { Component, OnInit, Input, ViewChild } from '@angular/core';
  import { ToasterService } from 'angular2-toaster';
  import { Router, ActivatedRoute } from '@angular/router';

  import { Tag } from '../../tag-management/tag.model';
  import { TagService } from '../../tag-management/tag.service';

  @Component({
    selector: 'hip-remove-sub-tag',
    templateUrl: '../app/tag-management/remove-sub-tags/remove-sub-tags.component.html',
  })

  export class RemoveSubTagComponent implements OnInit{


    @Input() tag: Tag = Tag.emptyTag();
    private allTags: Tag[] = [];
    private childrenTags: Tag[] = [];
    childTag: Tag = Tag.emptyTag();
    private disabledButtons: String[] =[];

    constructor(private tagService: TagService,
      private route: ActivatedRoute,
      private toasterService: ToasterService) {
    }

    ngOnInit() {
      if (this.route.snapshot.url[0].path === 'tags' && this.route.snapshot.url[1].path === 'remove-sub-tag') {
        let id = +this.route.snapshot.params['id']; 
        this.tagService.getTag(id).then(
          (response: any) => {
            this.tag = <Tag> response; 
            this.getChildrenTags();
          }
          ).catch(
          (error: any) => this.toasterService.pop('error', 'Error fetching tag', error)
          );
        }
      }


      private clicked(childTagId: number, childName: string){
        this.disabledButtons.push( childTagId.toString()); 
        this.childTag.id = childTagId;
        this.tagService.unsetChildTag(this.tag.id, this.childTag.id)  
        .then(
          (response: any) => this.handleResponseRemove(response, childName)
          )
        .catch(
          (error: any) => this.handleError(error)
          );
      }


      private isDisabled(childTagId: any){
        let child = childTagId.toString();
        if(this.disabledButtons.includes(child)){
          return true;
        }
        else{

          return false;}
        }


        private getChildrenTags() {
          this.tagService.getChildTags(this.tag.id).then(
            (response: any) => this.childrenTags = <Tag[]> response
            ).catch(
            (error: any) => this.toasterService.pop('error', 'Error fetching children of the tag', error)
            );
          }


          private handleResponseRemove(response: any, childName: string) {
            this.showToastSuccess('Tag "' + childName + '" removed');
          }

          private handleError(error: string) {
            this.toasterService.pop('error', 'Error while saving', error);
          }

          private showToastSuccess(s2: string) {
            this.toasterService.pop('success', 'Success', s2);
          }

        }
