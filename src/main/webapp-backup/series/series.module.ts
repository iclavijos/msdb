import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { SeriesComponent } from './series.component';
import { SeriesDetailComponent } from './series-detail.component';
import { SeriesUpdateComponent } from './series-update.component';
import { SeriesDeletePopupComponent, SeriesDeleteDialogComponent } from './series-delete-dialog.component';
import { seriesRoute, seriesPopupRoute } from './series.route';

const ENTITY_STATES = [...seriesRoute, ...seriesPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [SeriesComponent, SeriesDetailComponent, SeriesUpdateComponent, SeriesDeleteDialogComponent, SeriesDeletePopupComponent],
  entryComponents: [SeriesDeleteDialogComponent]
})
export class MotorsportsDatabaseSeriesModule {}
