import { NgModule } from '@angular/core';

import { MotorsportsDatabaseStandingsModule } from '../standings/standings.module';
import { SharedModule } from '../../shared/shared.module';
import { SeriesEditionComponent } from './series-edition.component';
import { SeriesEditionDetailComponent } from './series-edition-detail.component';
import { SeriesEditionUpdateComponent } from './series-edition-update.component';
import { SeriesEditionCalendarDialogComponent } from './series-edition-calendar-dialog.component';
import { SeriesEditionCalendarRemoveDialogComponent } from './series-edition-calendar-remove-dialog.component';
import { SeriesEditionCloneDialogComponent } from './series-edition-clone-dialog.component';
import { SeriesEditionCalendarSubscriptionDialogComponent } from './series-edition-calendar-subscription-dialog.component';
import { SeriesEditionRoutingModule } from './series-edition.route';

@NgModule({
  imports: [MotorsportsDatabaseStandingsModule, SharedModule, SeriesEditionRoutingModule],
  declarations: [
    SeriesEditionComponent,
    SeriesEditionDetailComponent,
    SeriesEditionUpdateComponent,
    SeriesEditionCalendarDialogComponent,
    SeriesEditionCalendarRemoveDialogComponent,
    SeriesEditionCloneDialogComponent,
    SeriesEditionCalendarSubscriptionDialogComponent
  ],
  exports: [SeriesEditionComponent]
})
export class MotorsportsDatabaseSeriesEditionModule {}
