import { NgModule } from '@angular/core';

import { MotorsportsDatabaseSharedModule } from '../../shared/shared.module';
import { SeriesComponent } from './series.component';
import { SeriesDetailComponent } from './series-detail.component';
import { SeriesUpdateComponent } from './series-update.component';
import { SeriesDeletePopupComponent, SeriesDeleteDialogComponent } from './series-delete-dialog.component';
import { SeriesRoutingModule } from './series.route';

import { MotorsportsDatabaseSeriesEditionModule } from '../series-edition/series-edition.module';

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, SeriesRoutingModule, MotorsportsDatabaseSeriesEditionModule],
  declarations: [SeriesComponent, SeriesDetailComponent, SeriesUpdateComponent, SeriesDeleteDialogComponent, SeriesDeletePopupComponent]
})
export class MotorsportsDatabaseSeriesModule {}
