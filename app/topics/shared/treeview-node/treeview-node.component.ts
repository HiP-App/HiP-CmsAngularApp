import { Component, Input, OnInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Topic } from '../topic.model';
import { TopicService } from '../topic.service';

@Component({
  moduleId: module.id,
  selector: 'hip-treeview',
  templateUrl: 'treeview-node.component.html',
  styleUrls: ['treeview-node.component.css']
})
export class TreeView implements OnInit {
  @Input() topic: Topic;
  topics: Array<Topic>;
  isAllow = false;
  expanded = false;
  countSubtopics: number;
  cnountLoadChildren = 5;
  translatedResponse: any;

  constructor(private topicService: TopicService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    this.topicService.getSubTopics(this.topic.id)
      .then(
        (response: any) => {
          this.topics = response;
          this.countSubtopics = this.topics.length;
        }
      ).catch(
        (error: any) => {
          console.log('Error in fetching subtopics: ' + error);
        }
      );
  }

  loadChildren() {
    this.cnountLoadChildren = this.cnountLoadChildren + 5;
  }

  getSubtopics(id: number) {
    this.topicService.getSubTopics(id)
      .then(
        (response: any) => {
          this.topics = response;
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error fetching Subtopics'), error.message);
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

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      value => {
        this.translatedResponse = value;
      }
    );
    return this.translatedResponse;
  }
}
