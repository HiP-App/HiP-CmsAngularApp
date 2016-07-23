import { Component, Input } from '@angular/core';
import { Topic } from '../shared/topic.model';

@Component({
    selector: 'tree-view',
    templateUrl: './app/topics/all-topics/all-topics.component.html',
    styleUrls: ['./app/topics/all-topics/all-topics.component.css'],
    directives: [TreeView]
})

export class TreeView {
    @Input() topics: Array<Topic>;
}