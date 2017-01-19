import { Injectable } from '@angular/core';

@Injectable()
export class ScrollService {
  private listener: ScrollListener[] = []

  public triggerListener(event: any) {
    for(let scrollListner of this.listener) {
      scrollListner.onScroll(event);
    }
  }

  public registerListener(scrollListener: ScrollListener) {
    this.listener.push(scrollListener);
  }

  public unregisterListener(scrollListener: ScrollListener) {
    let index = this.listener.indexOf(scrollListener);
    this.listener.splice(index, 1);
  }
}

export interface ScrollListener {
  onScroll(event: any): void;
}