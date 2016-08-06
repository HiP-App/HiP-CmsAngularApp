import { Component, Input } from '@angular/core';
import { Topic } from '../shared/topic.model';

import { UserService } from '../../shared/user/user.service';

@Component({
	selector: 'tree-view',
	templateUrl: './app/topics/all-topics/all-topics.component.html',
	styleUrls: ['./app/topics/all-topics/all-topics.component.css'],
	directives: [TreeView],
	providers: [UserService]
})

export class TreeView {
	@Input() topics: Array<Topic>;
	isAllow = false;

	constructor(private userService:UserService)
	{}

	private OnClick(topic: any){
		console.log(topic);
		if(topic.reviewer.role === 'Supervisor')
		{
			console.log("Its a Supervisor")
			this.isAllow = false;
		}
		else{

			// this.userService.getCurrent()
			// 	.then(response => this.handleResponse(response))
			// 	.catch(error => this.handleError(error))
			this.isAllow = true;
		}
	}

	private handleResponse(response: any)
	{

	}

	private handleError(response: any)
	{
		
	}

}

