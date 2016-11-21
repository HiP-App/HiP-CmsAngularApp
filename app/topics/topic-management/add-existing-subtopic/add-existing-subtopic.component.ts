import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { Observable } from 'rxjs';

import { TopicService } from '../../shared/topic.service';
import { Topic } from '../../shared/topic.model';

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
  topic = Topic.emptyTopic();
  searchResults: Topic[];
  parentTopic = Topic.emptyTopic();
  topics: Observable<Topic[]>;
  errorMessage: any;

  constructor(private topicService: TopicService,
              private toasterService: ToasterService) {

    this.parentTopic.subTopics = [];
    this.showChange = new EventEmitter<boolean>();
  }

  hideComponent() {
    this.show = false;
    this.showChange.emit(this.show);
  }

  public searchTopics() {
    if (this.query.length >= 1) {
      return this.topicService.findTopic(this.query)
        .then(
          (response: any) => {
            this.searchResults = response;
          }
        ).catch(
          (error: any) => {
            this.errorMessage = error;
            this.toasterService.pop('error', error);
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
          console.log(index);
          this.searchResults.splice(index, 1);
        }
      ).catch(
      (error: any) => {
        this.toasterService.pop('error', 'Subtopic ' + topic.title + ' exist already for topic ' + this.parent.title)
      }
    )
  }
}
