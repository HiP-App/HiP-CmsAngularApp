import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { MdButton } from '@angular2-material/button';
import { MdList, MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdSidenav, MdSidenavLayout } from '@angular2-material/sidenav';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { MyTopicsComponent } from '../../topics/my-topics-list.component';
import { ToolbarComponent } from './../toolbar/toolbar.component';
import { FooterComponent } from './../footer/footer.component';

@Component({
    selector: 'hip-sidenav',
    templateUrl: './app/shared/sidenav/sidenav.component.html',
    directives: [
        MdButton,
        MdList,
        MD_LIST_DIRECTIVES,
        MdSidenav,
        MdSidenavLayout,
        DashboardComponent,
        ToolbarComponent,
        FooterComponent,
        ROUTER_DIRECTIVES
    ],
    providers: [ROUTER_PROVIDERS]
})
@RouteConfig([
    {
        path: '/my-topics',
        name: 'MyTopics',
        component: MyTopicsComponent
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardComponent,
        useAsDefault: true
    },
])
export class SidenavComponent {
    navigation = [
        {
            'link': 'Dashboard',
            'name': 'Dashboard'
        },
        {
            'link': 'MyTopics',
            'name': 'My Topics'
        }
    ];

}
