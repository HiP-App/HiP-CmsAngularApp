import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';



@Component({
  moduleId: module.id,
  selector: 'hip-routes-detail-dialog',
  templateUrl: 'routes-detail.component.html',
  styleUrls: ['routes-detail.component.css']

})
export class RoutesDetailComponent {

  constructor(public dialogRef: MdDialogRef<RoutesDetailComponent>) {}

}
