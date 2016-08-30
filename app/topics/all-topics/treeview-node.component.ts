import { Component, Input } from '@angular/core';
import { Topic } from '../shared/topic.model';

import { UserService } from '../../shared/user/user.service';
import { TopicService } from '../shared/topic.service';


@Component({
	selector: 'hip-treeview',
	templateUrl: './app/topics/all-topics/treeview-node.component.html',
	styleUrls: ['./app/topics/all-topics/all-topics.component.css'],
	directives: [TreeView],
	providers: [UserService, TopicService]
})

export class TreeView {
	@Input() topic: Topic;
	topics: Array<Topic>;
	isAllow = false;

	expanded = false;
	countSubtopics: number;

	constructor(private userService:UserService, private topicService: TopicService)
	{}

	// private OnClick(){
	// 	console.log();
	// 	if(this.topic.reviewer.role === 'Supervisor')
	// 	{
	// 		console.log("Its a Supervisor")
	// 		this.isAllow = false;
	// 	}
	// 	else{
	// 		this.isAllow = true;
	// 	}
	// }

	ngOnInit()
	{	
		console.log("ngOnInit: "+this.topic.id)
		this.topicService.getSubTopics(this.topic.id)
		.then(
			response => {
				this.topics = response;
				this.countSubtopics = this.topics.length;
				console.log("In subtopics:"+this.topics.length);
			}
			)
		.catch(
			error => {
				console.log("Error in fetching subtopics")
			}
			)
	}

	getSubtopics(id: number)	
	{
		this.topicService.getSubTopics(id)
		.then(
			response => {
				this.topics = response;
				console.log("In subtopics:"+this.topics.length);
			}
			)
		.catch(
			error => {
				console.log("Error in fetching subtopics")
			}
			)
	}

	toggle() {
		console.log(this.expanded);
		this.expanded = !this.expanded;
		if(this.expanded === true)
		{
			this.getSubtopics(this.topic.id);
		}
	}

	get getIcon() {
		if(this.countSubtopics === 0) {
			return '';
		}
		else if(this.expanded) {
			return '-';
		}
		else {
			return '+';
		}
	}


}

