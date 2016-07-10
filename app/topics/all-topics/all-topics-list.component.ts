import { Component } from '@angular/core';

import { TopicDirectory } from './topic-directory.component';
import { TreeView } from './all-topics.component';

@Component({
	selector: 'allTopicsList',
	templateUrl: './app/topics/all-topics/all-topics-list.component.html',
	directives: [TreeView]
})

export class AllTopicsComponent{
	directories: Array<TopicDirectory>;

	constructor(){
		this.loadTopics();
	}

	loadTopics(){
		let title1 = new TopicDirectory('Title 1',[],['This is the first title name'])
		let title2 = new TopicDirectory('Title 2',[],['This is the second title name'])
		let title3 = new TopicDirectory('Title 3',[],['This is the third title name'])
		let subtopic1 = new TopicDirectory('Sub Topic 1',[title1,title2, title3],[]);
		let subtopic2 = new TopicDirectory('Sub Topic 2',[],['Title 1', 'Title 2', 'Title 3']);
		let topic1 = new TopicDirectory('Topic 1',[subtopic1],[])
		let topic2 = new TopicDirectory('Topic 2',[subtopic2],[])

		this.directories = [topic1, topic2];

	}

}