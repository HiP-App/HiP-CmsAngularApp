import { Component, OnInit } from '@angular/core';

import { TopicDirectory } from './topic-directory.component';
import { TreeView } from './all-topics.component';
import { TopicService } from '../shared/topic.service';
import { CmsApiService } from '../../shared/api/cms-api.service';
import { UserService } from '../../shared/user/user.service';

import { Topic } from '../shared/topic.model'

@Component({
	selector: 'allTopicsList',
	templateUrl: './app/topics/all-topics/all-topics-list.component.html',
	directives: [TreeView],
	providers: [TopicService, CmsApiService, UserService]
})

export class AllTopicsComponent implements OnInit{
	directories: Array<TopicDirectory>;

	topics: Array<Topic>;
	expanded = false;

		topic1 = Topic.emptyTopic();
		topic2 = Topic.emptyTopic();

	constructor(private topicService:TopicService){
		//this.loadTopics();
		let title1 = this.topic1.title;

	}

	ngOnInit()
	{
		this.topicService.getAllTopics()
		.then (
			response => this.handleResponse(response)
		)

		.catch (
			error => this.handleError(error)
		);
	}

	private handleResponse(response: Topic[])
	{
		this.topics = response
		console.log(this.topics);
	}

	private handleError(error: any)
	{
		console.log("Error in fetching the topics");
	}

	 toggle() {
		alert("Toggleee");
    this.expanded = !this.expanded;
  }

   getIcon() {
  alert("getIcon");

  if(this.expanded) {
    return '-';
  }
  else {
    return '+';
  }

}

