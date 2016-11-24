import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';

import { Topic } from '../../shared/topic.model';
import { TopicService } from '../../shared/topic.service';
import { User } from '../../../core/user/user.model';
import { UserService } from '../../../core/user/user.service';

@Component({
  selector: 'hip-delete-topic',
  templateUrl: './app/topics/topic-management/delete-subtopic/delete-subtopic.component.html',
  styleUrls: ['./app/topics/topic-management/delete-topic/delete-topic.component.css']
})
export class DeleteSubtopicComponent implements OnInit {
  topic: Topic = Topic.emptyTopic();
  private parentid: number;
  private subtopicid: number;

  constructor(private topicService: TopicService,
              private route: ActivatedRoute,
              private router: Router,
              private toasterService: ToasterService) {
  }

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'topics' && this.route.snapshot.url[2].path === 'delete-subtopic') {
      this.parentid = +this.route.snapshot.params['parentid'];
      this.subtopicid = +this.route.snapshot.params['childid'];
    }
  }

  deleteSubtopic() {
    this.topicService.deleteSubtopic(this.parentid, this.subtopicid).then(
      (response: any) => this.handleResponseDelete(response)
    ).catch(
      (error: any) => this.handleError(error)
    );
  }

  private handleResponseDelete(response: any) {
    this.toasterService.pop('success', 'Success', 'Topic "' + this.topic.title + '" deleted');
    setTimeout(() => {
      this.router.navigate(['topics/',this.parentid]);
    }, 2000);
  }

  private handleError(error: string) {
    this.toasterService.pop('error', 'Error while deleting', error);
  }
}
