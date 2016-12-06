import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

import { Topic } from '../../shared/topic.model';
import { TopicService } from '../../shared/topic.service';
import { User } from '../../../core/user/user.model';
import { UserService } from '../../../core/user/user.service';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'hip-delete-topic',
  templateUrl: './app/topics/topic-management/delete-topic/delete-topic.component.html',
  styleUrls: ['./app/topics/topic-management/delete-topic/delete-topic.component.css']
})
export class DeleteTopicComponent implements OnInit {
  topic: Topic = Topic.emptyTopic();
  isReady: boolean = false;       // used to disable delete button until user and topic are fetched
  private currentUser: User = User.getEmptyUser();
  private isTopicLoaded: boolean = false;
  private isUserLoaded: boolean = false;
  translatedResponse: any;
  getTranslatedData: any;

  constructor(private topicService: TopicService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private toasterService: ToasterService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'topics' && this.route.snapshot.url[1].path === 'delete') {
      let id = +this.route.snapshot.params['id'];

      // fetch topic to delete
      this.topicService.getTopic(id).then(
        (response: any) => {
          this.topic = <Topic> response;
          this.isTopicLoaded = true;
          this.isReady = this.isUserLoaded;
        }
      ).catch(
        (error: any) => {
          this.getTranslatedData = this.translatedData('Error fetching topic');
          this.toasterService.pop('error', this.getTranslatedData, error);
        }
      );

      // fetch current user
      this.userService.getCurrent().then(
        (response: any) => {
          this.currentUser = <User> response;
          this.isUserLoaded = true;
          this.isReady = this.isTopicLoaded;
        }
      ).catch(
        (error: any) => {
          this.getTranslatedData = this.translatedData('Error fetching current user');
          this.toasterService.pop('error', this.getTranslatedData, error);
        }
      );
    }
  }

  deleteTopic() {
    this.topicService.deleteTopic(this.topic.id).then(
      (response: any) => this.handleResponseDelete(response)
    ).catch(
      (error: any) => this.handleError(error)
    );
  }

  private handleResponseDelete(response: any) {
    this.getTranslatedData = this.translatedData('Topic deleted');
    this.toasterService.pop('success', 'Success', this.topic.title + ' - ' + this.getTranslatedData);
    setTimeout(() => {
      this.router.navigate(['/my-topics']);
    }, 2000);
  }

  private handleError(error: string) {
    this.getTranslatedData = this.translatedData('Error while deleting');
    this.toasterService.pop('error', this.getTranslatedData, error);
  }

  translatedData(data: any) {
    this.translateService.get(data).subscribe(
      value => {
        this.translatedResponse = value;
      }
    )
    return this.translatedResponse;
  }
}
