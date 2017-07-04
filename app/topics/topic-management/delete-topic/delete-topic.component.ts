import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { TranslateService } from 'ng2-translate';

import { Topic } from '../../shared/topic.model';
import { TopicService } from '../../shared/topic.service';
import { User } from '../../../users/user.model';
import { UserService } from '../../../users/user.service';

@Component({
  moduleId: module.id,
  selector: 'hip-delete-topic',
  templateUrl: 'delete-topic.component.html'
})
export class DeleteTopicComponent implements OnInit {
  topic: Topic = Topic.emptyTopic();
  isReady = false; // used to disable delete button until user and topic are fetched
  private currentUser: User = User.getEmptyUser();
  private isTopicLoaded = false;
  private isUserLoaded = false;
  translatedResponse: any;

  constructor(private topicService: TopicService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private toasterService: ToasterService,
              private translateService: TranslateService) {}

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'topics' && this.route.snapshot.url[1].path === 'delete') {
      let id = +this.route.snapshot.params['id'];

      // fetch topic to delete
      this.topicService.getTopic(id)
        .then(
          (response: any) => {
            this.topic = <Topic> response;
            this.isTopicLoaded = true;
            this.isReady = this.isUserLoaded;
          }
        ).catch(
          (error: any) => {
            this.toasterService.pop('error', this.getTranslatedString('Error fetching topic'), error);
            this.router.navigate(['/error']);
          }
        );

      // fetch current user
      this.userService.getCurrent()
        .then(
          (response: any) => {
            this.currentUser = <User> response;
            this.isUserLoaded = true;
            this.isReady = this.isTopicLoaded;
          }
        ).catch(
          (error: any) => {
            this.toasterService.pop('error', this.getTranslatedString('Error fetching current user'), error);
          }
        );
    }
  }

  deleteTopic() {
    this.topicService.deleteTopic(this.topic.id)
      .then(
        (response: any) => this.handleResponseDelete(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
  }

  private handleResponseDelete(response: any) {
    this.toasterService.pop('success', this.topic.title + ' - ' + this.getTranslatedString('Topic deleted'));
    setTimeout(() => {
      this.router.navigate(['/my-topics']);
    }, 2000);
  }

  private handleError(error: string) {
    this.toasterService.pop('error', this.getTranslatedString('Error while deleting'), error);
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
