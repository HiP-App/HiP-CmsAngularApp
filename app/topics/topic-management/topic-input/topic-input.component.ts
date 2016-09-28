import { Component, Input, OnInit, Output, EventEmitter, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

import { Topic } from '../../index';
import { TopicService } from '../../shared/topic.service';


@Component({
  selector: 'hip-topic-input',
  templateUrl: './app/topics/topic-management/topic-input/topic-input.component.html',
  styleUrls: ['./app/topics/topic-management/topic-input/topic-input.component.css']
})
export class TopicInputComponent implements OnInit, OnChanges {


  @Input() depthLeft = 0;
  @Input() depth = 0;
  @Input() showContent = true;
  @Input() topic: Topic = Topic.emptyTopic();
  @Input() currentParent: Topic = null;
  @Output() topicChange = new EventEmitter<Topic>();

  students = '';
  subTopics: Topic[] = this.topic.subTopics;
  playAnimation = !this.showContent;

  constructor(private topicService: TopicService,
              private router: Router,
              private route: ActivatedRoute,
              private toasterService: ToasterService) {
  }

  updateData() {
    this.topicChange.emit(this.topic);
  }

  ngOnInit() {
    if (this.topic.deadline !== null) {
      this.topic.deadline = this.topic.deadline.slice(0, 10);
    }
    this.playAnimation = !this.showContent;
  }

  toggleContent() {
    this.showContent = !this.showContent;
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.topic = this.topic;
    console.log(this.topic);
  }

}
