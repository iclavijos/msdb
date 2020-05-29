import { NgModule } from '@angular/core';

import { MotorsportsDatabaseStandingsModule } from '../standings/standings.module';
import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { SeriesEditionComponent } from './series-edition.component';
import { SeriesEditionDetailComponent } from './series-edition-detail.component';
// import { SeriesEditionUpdateComponent } from './series-edition-update.component';
import { SeriesEditionRoutingModule } from './series-edition.route';

@NgModule({
  imports: [MotorsportsDatabaseStandingsModule, MotorsportsDatabaseSharedModule, SeriesEditionRoutingModule],
  declarations: [
    SeriesEditionComponent,
    SeriesEditionDetailComponent
    //     SeriesEditionUpdateComponent
  ],
  exports: [SeriesEditionComponent]
})
export class MotorsportsDatabaseSeriesEditionModule {}
