import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'hip-star-rating',
  templateUrl: 'star-rating.component.html',
  styleUrls: ['star-rating.component.css']
})
export class RatingComponent implements OnChanges {
  private range: {rating: number, iconValue: string }[] = [];
  private _value;

  @Input() rating: number;
  @Input() exhibitId: number;
  @Output() ratingClicked: EventEmitter<any> = new EventEmitter<any>();

  getStarRating() {
    this.range = [];
    if (this.rating.toString().split('.')[0] !== '0') {
      for (let y = 1; y <= Number(this.rating.toString().split('.')[0]); y++) {
        this.range.push({rating: y, iconValue: 'star'});
        this._value = Math.floor(Number(this.rating));
      }
    }
    if (this.rating.toString().split('.')[0] === '0') {
      for (let y = 1; y <= 5; y++) {
        this.range.push({rating: y, iconValue: 'star_border'});
      }
    }
    if (this.rating.toString().split('.')[1]) {
      for (let y = 1; y <= 1; y++) {
        this.range.push({rating: this._value + y, iconValue: 'star_half'});
      }
    }
    if (this.rating.toString().split('.')[0] !== '0' && this.rating.toString().split('.')[1]) {
      for (let y = 2; y <= 5 - Number(this.rating.toString().split('.')[0]); y++) {
        this.range.push({rating: this._value + y, iconValue: 'star_border'});
      }
    }
    if (this.rating.toString().split('.')[0] !== '0' && this.rating.toString().split('.')[1] === undefined) {
      for (let y = 1; y <= 5 - Number(this.rating.toString().split('.')[0]); y++) {
        this.range.push({rating: this._value + y, iconValue: 'star_border'});
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getStarRating();
  }

  onClick(value: number): void {
    this.ratingClicked.emit({
      exhibitId: this.exhibitId,
      rating: value
    });
  }
}
