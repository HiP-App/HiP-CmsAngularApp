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

	allTopics: Array<Topic>;
	subTopics: Array<Topic>;
	parentTopics: Array<Topic>;
	topics: Array<Topic>;

	topic= Topic.emptyTopic();

	constructor(private topicService:TopicService){
		this.subTopics = [];
		this.allTopics = [];
		this.parentTopics = [];
		this.topics = [];
	}

	ngOnInit()
	{	
		//Fetching all topics
		this.topicService.getAllTopics()
		.then (
			response => 
			{
				this.allTopics = response
				//console.log(this.allTopics)
				for(var i=0; i< this.allTopics.length; i++ )
				{
					console.log(this.allTopics[i].id);
					this.topicService.getParentTopics(this.allTopics[i].id)
					.then (
						response => this.handleResponse(response)
						)
					.catch (
						error => 
						{
							console.log("Error in fetching the parent topics")
						})
				}
			})
		.catch (
			error => 
			{
				console.log("Error in fetching the all topics")
			})	
	}

	private handleResponse(response: Topic[])
	{
		var isPresent = false;
		for(var i=0; i< response.length; i++)
		{
			for(var j=0; j< this.topics.length; j++)
			{
				if(response[i].id === this.topics[j].id)
				{
					isPresent = true;
					break;
				}
			}
			if(isPresent === false)	
			{
				this.topics.push(response[i])
			}	
		}
		console.log(this.topics)

	}	
}

