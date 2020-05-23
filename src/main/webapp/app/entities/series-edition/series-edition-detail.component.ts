import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SeriesEditionService } from './series-edition.service';
import { ISeriesEdition } from 'app/shared/model/series-edition.model';

import { ImagesService } from 'app/shared/services/images.service';

@Component({
  selector: 'jhi-series-edition-detail',
  templateUrl: './series-edition-detail.component.html',
  styleUrls: ['series-edition.scss']
})
export class SeriesEditionDetailComponent implements OnInit {
  seriesEdition: ISeriesEdition;
  isActive = false;
  genericPosterUrl: string;

  displayedColumns: string[] = ['date', 'name', 'poster', 'winners', 'buttons'];

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected seriesEditionService: SeriesEditionService,
    protected imagesService: ImagesService
  ) {
    this.genericPosterUrl = imagesService.getGenericRacePoster();
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ seriesEdition }) => {
      this.seriesEdition = seriesEdition;
      this.seriesEditionService.findEvents(seriesEdition.id).subscribe(events => (this.seriesEdition.events = events.body));
    });
  }

  previousState() {
    window.history.back();
  }

  private getPosterUrl(posterUrl: string): string {
    if (posterUrl) return posterUrl;

    return this.genericPosterUrl;
  }

  private getFaceUrl(faceUrl: string, numDrivers: number, thumbSize: number): string {
    return this.imagesService.getFaceUrl(faceUrl, thumbSize, thumbSize);
  }

  private concatDriverNames(drivers: any[]): string {
    return drivers.map(d => d.driverName).join(', ');
  }
}
