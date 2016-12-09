import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

import { TopicService } from '../../shared/topic.service';
import { Topic } from '../../shared/topic.model';
import { TranslateService } from 'ng2-translate';

@Component({
  moduleId: module.id,
  selector: 'hip-new-subtopic',
  templateUrl: 'add-new-subtopic.component.html',
  styleUrls: ['../shared/save-topic-view.component.css',
    'add-new-subtopic.component.css']
})
export class AddNewSubtopicComponent implements OnInit {

  topic = Topic.emptyTopic();
  parentTopicId: number;
  errorMessage: any;
  translatedResponse: any;

  constructor(private topicService: TopicService,
              private router: Router,
              private route: ActivatedRoute,
              private toasterService: ToasterService,
              private translateService: TranslateService) {

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

  private handleResponseCreate(response: any) {
    if (response.success) {
      try {
        this.router.navigate(['/topics', this.parentTopicId]);
      } catch (error) {
        console.log(error);
      }
    }
    else {
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

  private handleError(error: string) {
    this.toasterService.pop('error', this.getTranslatedString('Error while saving'), error);
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
