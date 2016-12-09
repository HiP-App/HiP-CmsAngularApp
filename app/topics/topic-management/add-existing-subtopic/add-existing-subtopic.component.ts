import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

import { TopicService } from '../../shared/topic.service';
import { Topic } from '../../shared/topic.model';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'hip-add-existing-subtopic',
  templateUrl: './app/topics/topic-management/add-existing-subtopic/add-existing-subtopic.component.html',
  styleUrls: ['./app/topics/topic-management/add-existing-subtopic/add-existing-subtopic.component.css']
})
export class AddExistingSubtopicComponent {
  @Input() show: boolean;
  @Input() parent = Topic.emptyTopic();
  @Input() subtopics: Topic[];
  @Output() showChange: EventEmitter<boolean>;
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();

  query: string = '';
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
            this.toasterService.pop('error', 'Error', this.getTranslatedString(this.errorMessage));
          }
        );
    }
  }

  addExistingTopic(topic: Topic) {
    this.topicService.addSubtopicToTopic(this.parent.id, topic.id)
      .then(
        (response: any) => {
          this.notify.emit(this.parent);
          let index = this.searchResults.indexOf(topic);
          this.searchResults.splice(index, 1);
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', 'Error', topic.title + ' - ' + this.getTranslatedString('Subtopic exists already for parent topic') + ' - ' + this.parent.title);
      }
    );
  }

  getTranslatedString(data: any) {
    this.translateService.get(data).subscribe(
      value => {
        this.translatedResponse = value;
      }
    )
    return this.translatedResponse;
  }
}
