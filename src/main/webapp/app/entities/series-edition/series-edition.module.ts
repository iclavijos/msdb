import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { SeriesEditionComponent } from './series-edition.component';
import { SeriesEditionDetailComponent } from './series-edition-detail.component';
import { SeriesEditionUpdateComponent } from './series-edition-update.component';
import { SeriesEditionDeletePopupComponent, SeriesEditionDeleteDialogComponent } from './series-edition-delete-dialog.component';
import { seriesEditionRoute, seriesEditionPopupRoute } from './series-edition.route';

const ENTITY_STATES = [...seriesEditionRoute, ...seriesEditionPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    SeriesEditionComponent,
    SeriesEditionDetailComponent,
    SeriesEditionUpdateComponent,
    SeriesEditionDeleteDialogComponent,
    SeriesEditionDeletePopupComponent
  ],
  entryComponents: [SeriesEditionDeleteDialogComponent]
})
export class MotorsportsDatabaseSeriesEditionModule {}
