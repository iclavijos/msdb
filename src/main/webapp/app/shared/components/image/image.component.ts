import { Component, Input, Renderer2, OnInit } from '@angular/core';

import { Lightbox, IAlbum } from 'ngx-lightbox';

@Component({
  selector: 'jhi-popup-image',
  templateUrl: './image.component.html'
})
export class ImageComponent implements OnInit {

  @Input() imageUrl!: string;
  @Input() imageAlt!: string;

  private album: Array<IAlbum> = [];

  constructor(
    private lightbox: Lightbox,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.album = [
       {
         src: this.imageUrl,
         thumb: ''
       }
     ];
  }

  zoomIn(elementToZoom: HTMLElement): void {
    this.renderer.setStyle(elementToZoom, 'transform', 'scale(1.1)');
  }

  zoomOut(elementToUnzoom: HTMLElement): void {
    this.renderer.setStyle(elementToUnzoom, 'transform', 'scale(1.0)');
  }

  open(): void {
    this.lightbox.open(this.album, 0);
  }

  close(): void {
    this.lightbox.close();
  }

}
