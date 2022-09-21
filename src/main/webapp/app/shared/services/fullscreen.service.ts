import { Injectable } from '@angular/core';

@Injectable()
export class FullScreenService {
  private doc = <FullScreenDocument>document;

  enter(): void {
    const el = this.doc.documentElement;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }

  leave(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.doc.exitFullscreen) {
      this.doc.exitFullscreen();
    } else if (this.doc.msExitFullscreen) {
      this.doc.msExitFullscreen();
    } else if (this.doc.mozCancelFullScreen) {
      this.doc.mozCancelFullScreen();
    } else if (this.doc.webkitExitFullscreen) {
      this.doc.webkitExitFullscreen();
    }
  }

  toggle(): void {
    if (this.enabled) {
      this.leave();
    } else {
      this.enter();
    }
  }

  get enabled(): boolean {
    return !!(
      this.doc.fullscreenElement ??
      this.doc.mozFullScreenElement ??
      this.doc.webkitFullscreenElement ??
      this.doc.msFullscreenElement
    );
  }
}

interface FullScreenDocument extends HTMLDocument {
  documentElement: FullScreenDocumentElement;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitFullscreenElement?: Element;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
  webkitExitFullscreen?: () => void;
}

interface FullScreenDocumentElement extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  webkitRequestFullscreen?: () => void;
}
