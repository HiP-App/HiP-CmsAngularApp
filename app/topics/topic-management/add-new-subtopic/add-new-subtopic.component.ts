import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { NewTopicComponent } from '../new-topic/new-topic.component';
import { Topic } from '../../shared/topic.model';
import { TopicService } from '../../shared/topic.service';

@Component({
  moduleId: module.id,
  selector: 'hip-new-subtopic',
  templateUrl: '../shared/save-topic-view.component.html',
  styleUrls: ['../shared/save-topic-view.component.css']
})
export class AddNewSubtopicComponent extends NewTopicComponent implements OnInit {
  topic = Topic.emptyTopic();
  parentTopicId: number;
  errorMessage: any;
  translatedResponse: any;

  constructor(topicService: TopicService,
              router: Router,
              private route: ActivatedRoute,
              toasterService: ToasterService,
              translateService: TranslateService) {
    super(topicService, router, toasterService, translateService);
  }

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'topics' && this.route.snapshot.url[2].path === 'new-subtopic') {
      this.parentTopicId = +this.route.snapshot.params['id']; // (+) converts string 'id' to a number
    }
  }

  public saveTopic() {
    this.topicService.createTopic(this.topic)
      .then(
        (response: any) => {
          this.handleResponseCreate(response);
          this.updateParent(response.value);
        }
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  handleResponseCreate(response: any) {
    if (response.success) {
      try {
        this.router.navigate(['/topics', this.parentTopicId]);
      } catch (error) {
        console.error(error);
      }
    } else {
      this.toasterService.pop('error', 'Error', this.getTranslatedString('Error while saving'));
    }
  }

  private updateParent(subtopicId: number) {
    this.topicService.addSubtopicToTopic(this.parentTopicId, subtopicId)
      .catch(
        (error: any) => {
          this.toasterService.pop('error', this.getTranslatedString('Error while updating'), error);
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
