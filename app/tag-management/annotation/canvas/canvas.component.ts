import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
@Component({
  moduleId: module.id,
  selector: 'hip-canvas',
  templateUrl: 'canvas.component.html'
})
export class CanvasComponent implements OnInit, OnChanges {
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() followMouse: boolean = false;
  @Input() lastElement: HTMLElement;

  lastx: number;
  lasty: number;
  mousePath: string = 'M 131 165 C 131 78.19999999999999 565 380.2 565 467';

  @ViewChild('svg') svg: ElementRef;

  static findAbsolutePosition(htmlElement: HTMLElement) {
    let x = htmlElement.offsetLeft;
    let y = htmlElement.offsetTop;
    for (let x = 0, y = 0, el = htmlElement;
         el != null;
         el = el.offsetParent as HTMLElement) {
      x += el.offsetLeft;
      y += el.offsetTop;
    }
    console.log('absolutePosition: ' + x + ', ' + y);
    return {
      "x": x,
      "y": y
    };
  }

  constructor() {
  }

  ngOnInit() {
    document.onmousemove = (event: any) => this.calculateMousePath(event);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((<any> changes).width !== undefined) {
      this.svg.nativeElement.setAttribute('width', (<any> changes).width.currentValue);
    }
    if ((<any> changes).height !== undefined) {
      this.svg.nativeElement.setAttribute('height', (<any> changes).height.currentValue);
    }
    if ((<any> changes).followMouse) {
      this.updateLastPosition();
    }
  }

  updateLastPosition() {
    if (this.lastElement === null || this.lastElement === undefined) {
      return;
    }
    let pos = CanvasComponent.findAbsolutePosition(this.lastElement);
    this.lastx = pos.x + (this.lastElement.offsetWidth / 2);
    this.lasty = pos.y;
  }

  calculateMousePath(event: any) {
    if (!this.followMouse) {
      return;
    }
    let x2 = event.layerX;
    let y2 = event.layerY;

    console.log(this.lastx);
    const delta = (x2 - this.lastx) * 0.2;
    const hx1 = this.lastx;
    const hy1 = this.lasty - delta;
    const hx2 = x2;
    const hy2 = y2 - delta;
    this.mousePath = "M " + this.lastx + " " + this.lasty +
      " C " + hx1 + " " + hy1
      + " " + hx2 + " " + hy2
      + " " + x2 + " " + y2;
    console.log(event);
    let mp = this.svg.nativeElement.getElementById('mouse');
    mp.setAttribute('d', this.mousePath);
  }

  getSVG() {
    return this.svg.nativeElement;
  }

  connectTags(first: HTMLElement, second: HTMLElement, color: string = 'rgba(255,0,0,.7)', tension: number = 0.2): string {
    console.log('connectTags');
    let firstPos = CanvasComponent.findAbsolutePosition(first);
    let secondPos = CanvasComponent.findAbsolutePosition(second);

    let x1 = firstPos.x;
    let y1 = firstPos.y;

    let x2 = secondPos.x;
    let y2 = secondPos.y;

    x1 += (first.offsetWidth / 2);
    x2 += (second.offsetWidth / 2);

    if (x1 > x2) {
      return this.drawCurvedLine(x2, y2, x1, y1, color, tension);
    } else {
      return this.drawCurvedLine(x1, y1, x2, y2, color, tension);
    }
  }

  drawCurvedLine(x1: number, y1: number, x2: number, y2: number, color: string, tension: number) {
    let svg = this.getSVG();
    let shape = document.createElementNS("http://www.w3.org/2000/svg",
      "path");
    {
      const delta = (x2 - x1) * tension;
      const hx1 = x1;
      const hy1 = y1 - delta;
      const hx2 = x2;
      const hy2 = y2 - delta;
      const path = "M " + x1 + " " + y1 +
        " C " + hx1 + " " + hy1
        + " " + hx2 + " " + hy2
        + " " + x2 + " " + y2;
      shape.setAttributeNS(null, "d", path);
      shape.setAttributeNS(null, "fill", "none");
      shape.setAttributeNS(null, "stroke", color);
      let title = `${x1}-${y1},${x2}-${y2}`;
      shape.setAttributeNS(null, 'title', title);
      svg.appendChild(shape);
      return title;
    }
  }

  deleteLine(name: string) {
    let paths = this.getSVG().getElementsByTagName('path');
    for (let path of paths) {
      if (path.getAttribute('title') === name) {
        path.parentElement.removeChild(path);
        return;
      }
    }
  }
}