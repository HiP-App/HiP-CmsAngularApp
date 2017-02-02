import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { DragulaService } from 'ng2-dragula';
import { TranslateService } from 'ng2-translate';
import { Subscription, BehaviorSubject } from 'rxjs/Rx';

import { Tag } from '../../tag.model';
import { TagService } from '../../tag.service';

@Component({
  moduleId: module.id,
  selector: 'hip-tag-list',
  templateUrl: 'tag-list.component.html',
  styleUrls: ['tag-list.component.css']
})
export class TagListComponent implements OnInit, OnDestroy {
  @Input() tags: BehaviorSubject<Tag[]>;
  @Input() tagsEditable: boolean;

  private translatedResponse: string;
  private subscriptions: Subscription[] = [];
  private layer: string;

  constructor (private dragulaService: DragulaService,
               private tagService: TagService,
               private toasterService: ToasterService,
               private translateService: TranslateService) {
  }

  ngOnInit() {
    this.layer = this.tags.getValue()[0].layer;

    this.dragulaService.setOptions('bag-' + this.layer, {
      accepts: function (el: any, target: any) {
        return !target.classList.contains('moving');
      },
    });

    this.subscriptions.push(
      this.dragulaService.drop.subscribe((value: any) => {
        if ('bag-' + this.layer === value[0]) {
          this.onDrop(value[1], value[2], value[3])
        }
      }),
      this.dragulaService.drag.subscribe((value: any) => {
        if ('bag-' + this.layer === value[0]) {
          TagListComponent.lockChildrenContainers(true, value.slice(1)[0]);
        }
      }),
      this.dragulaService.dragend.subscribe((value: any) => {
        if ('bag-' + this.layer === value[0]) {
          TagListComponent.lockChildrenContainers(false, value.slice(1)[0]);
          TagListComponent.hideEmptyContainers();
        }
      }),
      this.dragulaService.out.subscribe((value: any) => {
        if ('bag-' + this.layer === value[0]) {
          TagListComponent.hideEmptyContainers();
        }
      }),
      this.dragulaService.over.subscribe((value: any) => {
        if ('bag-' + this.layer === value[0]) {
          TagListComponent.onHover(value);
        }
      })
    );
  }

  ngOnDestroy() {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  private onDrop(el: any, target: any, source: any) {
    let childId = el.dataset['tagId'];
    let parentId = target.dataset['tagId'];
    let oldParentId = source.dataset['tagId'];

    if (parentId !== undefined) {
      this.tagService.setChildTag(+parentId, +childId)
        .catch(
          error => this.toasterService.pop('error', this.translate('Error while saving'), error)
        )
    } else {
      if(oldParentId !== undefined) {
        this.tagService.unsetChildTag(+oldParentId, +childId)
          .catch(
            error => this.toasterService.pop('error', this.translate('Error while saving'), error)
          )
      }
    }
  }

  private translate(data: string): string {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value as string;
      }
    );
    return this.translatedResponse;
  }

  private static lockChildrenContainers(lock: boolean, el: any){
    let initialState = lock ? "container" : 'moving';
    let finalState = lock ? "moving" : 'container';

    let childrenContainers = el.querySelectorAll("." + initialState);
    for(let i = 0; i < childrenContainers.length; i++){
      childrenContainers[i].classList.remove(initialState);
      childrenContainers[i].classList.add(finalState);
    }
  }

  private static onHover(value: any) {
    let target = value[2];
    let children = target.querySelectorAll('.show-on-hover');
    for (let child of children) {
      child.classList.add('hovered');
    }
  }

  private static hideEmptyContainers() {
    let children = document.querySelectorAll('.hovered');
    for (let i = 0; i < children.length; i++) {
      children[i].classList.remove('hovered');
    }
  }
}
