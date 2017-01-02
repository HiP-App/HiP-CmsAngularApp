import { Directive, ElementRef, HostBinding, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[hipFluidHeight]',
})
export class FluidHeightDirective implements OnInit {
  @HostBinding('style.height.px')
  height: number;

  constructor(private _elementRef: ElementRef) {}

  ngOnInit() {
    this.setHeight();
  }

  @HostListener('input')
  setHeight() {
    this.height = this._elementRef.nativeElement.scrollHeight + 2;
  }
}
