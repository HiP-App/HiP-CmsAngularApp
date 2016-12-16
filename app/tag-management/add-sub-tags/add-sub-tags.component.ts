import { Component, OnInit, Input} from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';

import { Tag } from '../../tag-management/tag.model';
import { TagService } from '../../tag-management/tag.service';

@Component({
  selector: 'hip-add-sub-tag',
  templateUrl: '../app/tag-management/add-sub-tags/add-sub-tags.component.html',
})

export class AddSubTagComponent implements OnInit{

  @Input() tag: Tag = Tag.emptyTag();
  private allTags: Tag[] = [];
  childTag: Tag = Tag.emptyTag();
  private disabledButtons: String[] =[];

  constructor(private tagService: TagService,
    private route: ActivatedRoute,
    private toasterService: ToasterService) {
  }

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'tags' && this.route.snapshot.url[1].path === 'add-sub-tag') {
      let id = +this.route.snapshot.params['id']; 

      this.tagService.getTag(id).then(
        (response: any) => {
          this.tag = <Tag> response;
          this.getAllTags(); 
        }
        ).catch(
        (error: any) => this.toasterService.pop('error', 'Error fetching tag', error)
        );
      }
    }


    private clicked(childTagId: any, childName: string){
      this.disabledButtons.push( childTagId.toString());
      this.childTag.id = childTagId;
      this.tagService.setChildTag(this.tag.id, this.childTag.id)
      .then(
        (response: any) => this.handleResponseSetTag(response, childName)
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
      else
      {
        return false;}
      }


     public getAllTags() {
        this.tagService.getAllTags()
        .then(
          (response: any) => {
            this.allTags = response;
          }
          )
        .catch(
          (error: any) => {
            this.toasterService.pop( 'error', 'Error', 'Not able to fetch your tags.');
          }
          );
      }


    private handleResponseSetTag(response: any, child: String) {
        this.showToastSuccess('Tag "' + child + '" added as Sub Tag');

      }

    private handleError(error: string) {
        this.toasterService.pop('error', 'Error while saving', error);
      }

    private showToastSuccess(s2: string) {
        this.toasterService.pop('success', 'Success', s2);
      }

    }
