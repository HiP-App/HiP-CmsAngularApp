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

  lastX: number;
  lastY: number;
  mousePath: string = '';

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

  constructor() {}

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
    this.lastX = pos.x + (this.lastElement.offsetWidth / 2);
    this.lastY = pos.y;
  }

  calculateMousePath(event: any) {
    if (!this.followMouse) {
      return;
    }
    let x2 = event.layerX;
    let y2 = event.layerY;

    console.log(this.lastX);
    const delta = (x2 - this.lastX) * 0.2;
    const hx1 = this.lastX;
    const hy1 = this.lastY - delta;
    const hx2 = x2;
    const hy2 = y2 - delta;
    this.mousePath = "M " + this.lastX + " " + this.lastY +
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
    let isEnoughSpaceY = Math.abs(y2-y1) > first.offsetHeight * 3;
    let biggestLength = first.offsetWidth > second.offsetWidth ? first.offsetWidth : second.offsetWidth;
    let isEnoughSpaceX = Math.abs(x2-x1) > biggestLength * 2;
    let isXSmallerY = Math.abs(x2-x1) / 2 < Math.abs(y2-y1);

    let drawAbove = isEnoughSpaceX && isEnoughSpaceY && !isXSmallerY;
    if(!drawAbove) {
      if (y1 > y2) {
        y2 += second.offsetHeight;
      } else if (y2 > y1) {
        y1 += first.offsetHeight;
      }
    }

    if (x1 > x2) {
      return this.drawCurvedLine(x2, y2, x1, y1, color, tension, drawAbove);
    } else {
      return this.drawCurvedLine(x1, y1, x2, y2, color, tension, drawAbove);
    }
  }

  drawCurvedLine(x1: number, y1: number, x2: number, y2: number, color: string, tension: number, above: boolean = true) {
    let svg = this.getSVG();
    let url = window.location.href;
    let shape = document.createElementNS("http://www.w3.org/2000/svg",
      "path");

    const delta = (x2 - x1) * tension;
    let hy1 = y1 - delta;
    let hy2 = y2 - delta;
    if(!above) {
      if (y2 > y1) {
        hy1 = y1 + delta;
      }
      if (y1 > y2) {
        hy2 = y2 + delta;
      }
    }

    const path = "M " + x1 + " " + y1 +
      " C " + x1 + " " + hy1
      + " " + x2 + " " + hy2
      + " " + x2 + " " + y2;
    shape.setAttributeNS(null, "d", path);
    shape.setAttributeNS(null, "fill", "none");
    shape.setAttributeNS(null, "stroke", color);
    shape.setAttributeNS(null, "marker-start", `url(${url}#arrow)`);
    shape.setAttributeNS(null, "marker-end", `url(${url}#arrow)`);
    let title = `${x1}-${y1},${x2}-${y2}`;
    shape.setAttributeNS(null, 'title', title);
    svg.appendChild(shape);
    return title;
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
