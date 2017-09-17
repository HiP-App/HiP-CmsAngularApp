import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'hip-star-rating',
  templateUrl: 'star-rating.component.html',
  styleUrls: ['star-rating.component.css']
})
export class RatingComponent {
  private range: Array<number> = [1, 2, 3, 4, 5];

  @Input() rating: number;
  @Input() exhibitId: number;
  @Output() ratingClicked: EventEmitter<any> = new EventEmitter<any>();


  onClick(value: number): void {
    this.rating = value;
    this.ratingClicked.emit({
      itemId: this.exhibitId,
      rating: this.rating
    });
  }

}
