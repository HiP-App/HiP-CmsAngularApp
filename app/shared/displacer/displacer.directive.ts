import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { TemplatePortal } from '@angular/material';

@Directive({
  selector: '[hipDisplacerPortal]'
})
export class DisplacerDirective extends TemplatePortal {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}