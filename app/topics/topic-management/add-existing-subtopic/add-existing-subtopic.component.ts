import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Topic } from '../../shared/topic.model';
import { TopicService } from '../../shared/topic.service';

@Component({
  moduleId: module.id,
  selector: 'hip-add-existing-subtopic',
  templateUrl: 'add-existing-subtopic.component.html',
  styleUrls: ['add-existing-subtopic.component.css']
})
export class AddExistingSubtopicComponent {
  @Input() show: boolean;
  @Input() parent = Topic.emptyTopic();
  @Input() subtopics: Topic[];
  @Output() showChange: EventEmitter<boolean>;
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();

  query = '';
  searchResults: Topic[];
  parentTopic = Topic.emptyTopic();
  errorMessage: any;
  translatedResponse: any;

  constructor(private topicService: TopicService,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
    this.parentTopic.subTopics = [];
    this.showChange = new EventEmitter<boolean>();
  }

  hideComponent() {
    this.show = false;
    this.showChange.emit(this.show);
  }

  private filterTopics() {
    for (let subtopic of this.subtopics) {
      for (let i = 0; i < this.searchResults.length; i++) {
        if (subtopic.id === this.searchResults[i].id || this.parent.id === this.searchResults[i].id) {
          this.searchResults.splice(i, 1);
          break;
        }
      }
    }
  }

  public searchTopics() {
    if (this.query.length >= 1) {
      return this.topicService.findTopic(this.query)
        .then(
          (response: any) => {
            this.searchResults = response;
            this.filterTopics();
          }
        ).catch(
          (error: any) => {
            this.errorMessage = error;
            this.toasterService.pop('error', this.getTranslatedString(this.errorMessage));
          }
        );
    }
  }

  addExistingTopic(topic: Topic) {
    this.topicService.addSubtopicToTopic(this.parent.id, topic.id)
      .then(
        () => {
          this.notify.emit(this.parent);
          let index = this.searchResults.indexOf(topic);
          this.searchResults.splice(index, 1);
        }
      ).catch(
        (error: any) => {
          this.toasterService.pop('error', topic.title + ' - '
            + this.getTranslatedString('Subtopic exists already for parent topic') + ' - ' + this.parent.title);
        }
      );
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      (value: any) => {
        this.translatedResponse = value;
      }
    );
    return this.translatedResponse;
  }
}
