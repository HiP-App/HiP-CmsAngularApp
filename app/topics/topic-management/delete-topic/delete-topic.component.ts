import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

import { Topic } from '../../shared/topic.model';
import { TopicService } from '../../shared/topic.service';
import { User } from '../../../core/user/user.model';
import { UserService } from '../../../core/user/user.service';

@Component({
  selector: 'hip-delete-topic',
  templateUrl: './app/topics/topic-management/delete-topic/delete-topic.component.html',
  styleUrls: ['./app/topics/topic-management/delete-topic/delete-topic.component.css']
})
export class DeleteTopicComponent implements OnInit {
  topic: Topic = Topic.emptyTopic();
  currentUser: User = User.getEmptyUser();
  isReady: boolean = false;       // used to disable delete button until user and topic are fetched
  private isTopicLoaded: boolean = false;
  private isUserLoaded: boolean = false;

  constructor(private topicService: TopicService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private toasterService: ToasterService) {
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
        (error: any) => this.toasterService.pop('error', 'Error fetching topic', error)
      );

      // fetch current user
      this.userService.getCurrent().then(
        (response: any) => {
          this.currentUser = <User> response;
          this.isUserLoaded = true;
          this.isReady = this.isTopicLoaded;
        }
      ).catch(
        (error: any) => this.toasterService.pop('error', 'Error fetching current user', error)
      );
    }
  }

  deleteTopic() {
    if (this.currentUser.id === this.topic.createdById) {
      this.topicService.deleteTopic(this.topic.id).then(
        (response: any) => this.handleResponseDelete(response)
      ).catch(
        (error: any) => this.handleError(error)
      );
    } else {
      this.toasterService.pop('error', 'Error while deleting', 'You can only delete topics created by you.');
    }
  }

  private handleResponseDelete(response: any) {
    this.toasterService.pop('success', 'Success', 'Topic "' + this.topic.title + '" deleted');
    setTimeout(() => {
      this.router.navigate(['/my-topics']);
    }, 2000);
  }

  private handleError(error: string) {
    this.toasterService.pop('error', 'Error while deleting', error);
  }
}
