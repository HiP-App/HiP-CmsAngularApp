import { Component, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { OverlayState, OverlayRef, Overlay } from '@angular/material';
import { DisplacerDirective } from './displacer.directive';

@Component({
  selector: 'hip-displacer',
  template: `
    <template hipDisplacerPortal>
      <ng-content></ng-content>
    </template>
   `
})
export class DisplacerComponent implements OnDestroy, AfterViewInit {

  private config = new OverlayState();

  @ViewChild(DisplacerDirective)
  private displacer: DisplacerDirective;

  private overlayRef: OverlayRef = undefined;

  constructor(private overlay: Overlay) {}

  public ngOnDestroy() {
    this.overlayRef.detach();
  }

  public ngAfterViewInit() {
    this.overlayRef = this.overlay.create(this.config);
    this.overlayRef.attach(this.displacer);
  }
}
