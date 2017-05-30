import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Exhibit } from '../../exhibits/shared/exhibit.model';
import { Route } from '../shared/route.model';
import { Medium } from '../../media/shared/medium.model';
import { SelectMediumDialogComponent } from '../../media/select-medium-dialog/select-medium-dialog.component';
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
  private selectDialogRef: MdDialogRef<SelectMediumDialogComponent>;

  constructor(private activatedRoute: ActivatedRoute,
              private dialog: MdDialog) {}

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

  selectMedium(type: string) {
    this.selectDialogRef = this.dialog.open(SelectMediumDialogComponent, { width: '75%', data: { type: type } });
    this.selectDialogRef.afterClosed().subscribe(
      (selectedMedium: Medium) => {
        if (selectedMedium) {
          // TODO: handle selected medium
        }
      }
    );
  }
}
