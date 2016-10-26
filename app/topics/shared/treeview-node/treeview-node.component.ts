import { Component, Input, OnInit } from '@angular/core';

import { Topic } from '../topic.model';
import { TopicService } from '../topic.service';
import { ToasterService } from 'angular2-toaster';
import { CmsApiService } from '../../../core/api/cms-api.service';



@Component({
  selector: 'hip-treeview',
  templateUrl: './app/topics/shared/treeview-node/treeview-node.component.html',
  styleUrls: ['./app/topics/shared/treeview-node/treeview-node.component.css']
})

export class TreeView implements OnInit {
  @Input() topic: Topic;
  topics: Array<Topic>;
  isAllow = false;
  expanded = false;
  countSubtopics: number;
  cnountLoadChildren = 2;

  constructor(private topicService: TopicService, private toasterService: ToasterService, private cmsApiService: CmsApiService) {
  }

  ngOnInit() {
    this.topicService.getSubTopics(this.topic.id)
    .then(
      (response: any) => {
        this.topics = response;
        this.countSubtopics = this.topics.length;
      }
      )
    .catch(
      (error: any) => {
        console.log('Error in fetching subtopics');
      }
      );
  }

  loadChildren()
  {
    this.cnountLoadChildren = this.cnountLoadChildren + 2;
  }

  getSubtopics(id: number) {
    this.topicService.getSubTopics(id)
    .then(
      (response: any) => {
        this.topics = response;
      }
      )
    .catch(
      (error: any) => {
        this.toasterService.pop('error', 'Error fetching Subtopics', error.message);
      }
      )
  }

  toggle() {
    this.expanded = !this.expanded;
    if (this.expanded === true) {
      this.getSubtopics(this.topic.id);
    }
  }

  get getIcon() {
    if (this.countSubtopics === 0) {
      return '';
    } else {
      if (this.expanded) {
        return '-';
      } else {
        return '+';
      }
    }
  }
}

