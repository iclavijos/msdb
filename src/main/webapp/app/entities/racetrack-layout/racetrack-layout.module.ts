import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { RacetrackLayoutDetailComponent } from './racetrack-layout-detail.component';
import { RacetrackLayoutUpdateComponent } from './racetrack-layout-update.component';
import { RacetrackLayoutDeletePopupComponent, RacetrackLayoutDeleteDialogComponent } from './racetrack-layout-delete-dialog.component';
import { racetrackLayoutRoute, racetrackLayoutPopupRoute } from './racetrack-layout.route';

const ENTITY_STATES = [...racetrackLayoutRoute, ...racetrackLayoutPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    RacetrackLayoutDetailComponent,
    RacetrackLayoutUpdateComponent,
    RacetrackLayoutDeleteDialogComponent,
    RacetrackLayoutDeletePopupComponent
  ],
  entryComponents: [RacetrackLayoutDeleteDialogComponent]
})
export class MotorsportsDatabaseRacetrackLayoutModule {}
