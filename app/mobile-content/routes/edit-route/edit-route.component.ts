import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Exhibit } from '../../exhibits/shared/exhibit.model';
import { Route } from '../shared/route.model';
import { Status } from '../../shared/status.model';

@Component({
  moduleId: module.id,
  selector: 'hip-routes-edit-dialog',
  templateUrl: 'edit-route.component.html',
  styleUrls: ['edit-route.component.css']
})
export class EditRouteComponent implements OnInit {
  route = Route.getRandom();
  statusOptions = Status.getValues();

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    let id = +this.activatedRoute.snapshot.params['id'];
    // TODO: fetch exhibit from server by id
  }

  editRoute(route: Route) {
    // TODO implement update route
  }

  moveExhibitDown(exhibit: Exhibit) {
    let index = this.route.exhibits.findIndex(item => item === exhibit);
    if (index < this.route.exhibits.length - 1) {
      this.swapExhibits(index, index + 1);
    }
  }

  moveExhibitUp(exhibit: Exhibit) {
    let index = this.route.exhibits.findIndex(item => item === exhibit);
    if ( index > 0) {
      this.swapExhibits(index, index - 1);
    }
  }

  private swapExhibits(index1: number, index2: number) {
    let temp = this.route.exhibits[index1];
    this.route.exhibits[index1] = this.route.exhibits[index2];
    this.route.exhibits[index2] = temp;
  }

  removeExhibit(exhibit: Exhibit) {
    this.route.exhibits = this.route.exhibits.filter(
      function (item) {
        return item.id !== exhibit.id;
      }
    );
  }
}
