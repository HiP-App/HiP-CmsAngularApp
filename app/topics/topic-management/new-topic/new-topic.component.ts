import { Component } from '@angular/core';
import { TopicService } from '../../shared/topic.service';
import { Topic } from '../../shared/topic.model';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { Response } from '@angular/http';

@Component({
  selector: 'hip-new-topic',
  templateUrl: './app/topics/topic-management/shared/save-topic-view.component.html',
  styleUrls: ['./app/topics/topic-management/shared/save-topic-view.component.css']
})
export class NewTopicComponent {
  topic = Topic.emptyTopic();

  constructor(private topicService: TopicService,
              private router: Router,
              private toasterService: ToasterService) {
  }

  public saveTopic() {
    this.topicService.createTopic(this.topic)
      .then(
        (response: any) => this.handleResponseCreate(response)
      )
      .catch(
        (error: any) => this.handleError(error)
      );
  }

  private handleResponseCreate(response: any) {
    if (response.success) {
      this.showToastSuccess('topic "' + this.topic.title + '" saved');
      console.log(response);
      try {
        this.router.navigate(['/topics', response.value]);
      } catch (error) {
        console.log(error);
      }
    } else {
      this.toasterService.pop('error', 'Error while saving', response.errorMessage);
    }
  }

  private handleError(error: string) {
    this.toasterService.pop('error', 'Error while saving', error);
  }

  private showToastSuccess(s2: string) {
    this.toasterService.pop('success', 'Success', s2);
  }
}
