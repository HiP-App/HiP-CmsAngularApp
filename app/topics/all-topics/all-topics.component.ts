import { Component, OnInit, Input } from '@angular/core';


import { TreeView } from './treeview-node.component';
import { TopicService } from '../shared/topic.service';
import { CmsApiService } from '../../shared/api/cms-api.service';
import { UserService } from '../../shared/user/user.service';
import { Topic } from '../shared/topic.model'


@Component({
	selector: 'allTopics',
	templateUrl: './app/topics/all-topics/all-topics.component.html',
	styleUrls: ['./app/topics/all-topics/all-topics.component.css'],
	directives: [TreeView],
	providers: [TopicService, CmsApiService, UserService]
})

export class AllTopicsComponent implements OnInit{

	allTopics: Array<Topic>;
	subTopics: Array<Topic>;
	parentTopics: Array<Topic>;
	topics: Array<Topic>;
	countSubtopics: number;

	topic= Topic.emptyTopic();

	constructor(private topicService:TopicService){
		this.subTopics = [];
		this.allTopics = [];
		this.parentTopics = [];
		this.topics = [];
	}

	ngOnInit()
	{	
		this.topicService.getAllTopics()
		.then ( 
			response => {
				this.topics = response
				this.countSubtopics = this.topics.length;
			}
			)
		.catch (
			error => 
			{
				console.log("Error in fetching the all topics")
			})
	}
}

