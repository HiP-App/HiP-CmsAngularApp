import { Component } from '@angular/core';

@Component({
    selector: 'hip-dashboard',
    templateUrl: './app/dashboard/dashboard.component.html'
})
export class DashboardComponent {
    langDashboard = 'Dashboard';
    langYourTopics = 'Your topics';
    activity = [
        {
            'title': 'Your topic: "History in Paderborn" was commented',
            'content': 'Dirk added a comment: "I really like that"'
        },
        {
            'title': 'New private message',
            'content': 'Bjorn wrote you a private message'
        },
        {
            'title': 'Your article was marked',
            'content': 'See the annotations your supervisor did'
        }
    ];
    topics = [
        {
            'title': 'History in Paderborn"',
            'content': 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod ' +
            'tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et ' +
            'accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus ' +
            'est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed ' +
            'diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ' +
            'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata ' +
            'sanctus est Lorem ipsum dolor sit amet.'
        },
        {
            'title': 'The three rabbits',
            'content': 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod ' +
            'tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et ' +
            'accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus ' +
            'est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed ' +
            'diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ' +
            'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata ' +
            'sanctus est Lorem ipsum dolor sit amet.'
        },
        {
            'title': 'Cathedral of Paderborn',

            'content': 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod ' +
            'tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et ' +
            'accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus ' +
            'est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed ' +
            'diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ' +
            'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata ' +
            'sanctus est Lorem ipsum dolor sit amet.'
        }
    ];
}
