import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { FluidHeightDirective } from './fluid-height.directive';

@Component({
  selector: 'hip-textarea',
  templateUrl: './app/shared/textarea/textarea.component.html',
  styleUrls: ['./app/shared/textarea/textarea.component.css'],
  directives: [FluidHeightDirective]
})
export class TextareaComponent {
  @Input() label: string;
  @Input() model: string;
  @Output() modelChange: any = new EventEmitter();

  updateData(event) {
    this.model = event;
    this.modelChange.emit(event);
  }
}
