import { Component, Input, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'hip-star-rating-table',
  templateUrl: 'star-rating-table.component.html',
  styleUrls: ['star-rating-table.component.css']
})

export class RatingTableComponent implements OnInit {

  @Input() rating: any;
  ratingTable: any;
  average: number;

  ngOnInit() {
    this.ratingTable = this.rating.ratingTable;
    this.average = this.rating.average;
  }
}
