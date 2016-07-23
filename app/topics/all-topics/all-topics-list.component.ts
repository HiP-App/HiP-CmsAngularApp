import { Component, OnInit } from '@angular/core';

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

	topics: Array<Topic>;
	expanded = false;

	topic1 = Topic.emptyTopic();
	topic2 = Topic.emptyTopic();

	constructor(private topicService:TopicService){

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
	}

	private handleError(error: any)
	{
		console.log("Error in fetching the topics");
	}
}

