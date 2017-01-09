import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'hip-pagination',
  templateUrl: 'pagination.component.html',
  styleUrls: ['pagination.component.css']
})
export class PaginationComponent {
  @Output()
  pageChange = new EventEmitter<number>();

  getPage(page: number) {
    this.pageChange.emit(page);
  }
}
