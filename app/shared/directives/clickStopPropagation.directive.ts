/*
  This directive is used to stop propagation
  of an event towards the elements parent(s).
*/

import { Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[click-stop-propagation]',
})
export class ClickStopPropagationDirective {
  @HostListener('click', ['$event'])
  onClick($event: any) {
    $event.stopPropagation();
  }
}
