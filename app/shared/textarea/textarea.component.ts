import { Component, Input, Output, EventEmitter } from '@angular/core';

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
  @Input() disabled: boolean = false;
  @Output() modelChange = new EventEmitter<string>();

  updateData() {
    this.modelChange.emit(this.model);
  }
}
