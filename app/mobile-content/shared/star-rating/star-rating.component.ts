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
          // Coverts a floating point value into integer
        this._value = Math.floor(Number(this.rating));
      }
    }
      // If we have no ratings for an exhibit, show five blank stars
    if (this.rating.toString().split('.')[0] === '0') {
      for (let y = 1; y <= 5; y++) {
        this.range.push({rating: y, iconValue: 'star_border'});
      }
    }
    if (this.rating.toString().split('.')[1]) {
        // Shows half star ratings for each exhibit
      for (let y = 1; y <= 1; y++) {
        this.range.push({rating: this._value + y, iconValue: 'star_half'});
      }
    }
      // Complete the remaining(blank) stars in case when we have a half star rating(floating point rating)
    if (this.rating.toString().split('.')[0] !== '0' && this.rating.toString().split('.')[1]) {
      for (let y =  Number(this.rating.toString().split('.')[0]); y < 4; y++) {
        this.range.push({rating: this._value + y, iconValue: 'star_border'});
      }
    }
      // Complete the remaining(blank) stars in case when we have no half star rating
    if (this.rating.toString().split('.')[0] !== '0' && this.rating.toString().split('.')[1] === undefined) {
      for (let y = Number(this.rating.toString().split('.')[0]); y < 5; y++) {
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