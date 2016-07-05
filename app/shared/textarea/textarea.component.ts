import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hip-textarea',
  templateUrl: './app/shared/textarea/textarea.component.html',
  styleUrls: ['./app/shared/textarea/textarea.component.css']
})
export class TextareaComponent implements OnInit {
  @Input() label: string;
  @Input() model: string;

  private rows = 1;

  ngOnInit() {
    this.rows = this.model.split(/\r\n|\r|\n/).length;
  }

  onKeyDown(event: any) {
    if (event.keyCode === 13) {
      this.rows = this.rows + 1;
    }
  }

  onKeyUp(event: any) {
    if (event.keyCode === 8) {
      this.rows = this.model.split(/\r\n|\r|\n/).length;
    }
  }
}
