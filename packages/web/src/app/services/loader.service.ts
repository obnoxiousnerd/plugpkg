import { Injectable, EventEmitter } from '@angular/core';

/**
 * A service that enables the app whether to show the app loader or not.
 */
@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loaderEvent: EventEmitter<boolean> = new EventEmitter();
  start(): void {
    this.loaderEvent.emit(true);
  }
  stop(): void {
    this.loaderEvent.emit(false);
  }
}
