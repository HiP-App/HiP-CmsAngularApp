import { Component, Input } from '@angular/core';
import { TopicDirectory } from './topic-directory.component';

@Component({
    selector: 'tree-view',
    templateUrl: './app/topics/all-topics/all-topics.component.html',
    styleUrls: ['./app/topics/tree-view/site.css'],
    directives: [TreeView]
})

export class TreeView {
    @Input() directories: Array<TopicDirectory>;
}