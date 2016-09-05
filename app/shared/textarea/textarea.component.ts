import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'hip-textarea',
  templateUrl: './app/shared/textarea/textarea.component.html',
  styleUrls: ['./app/shared/textarea/textarea.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextareaComponent),
    multi: true
  }]
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
