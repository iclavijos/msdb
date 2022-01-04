import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { RacetrackLayoutDetailComponent } from './racetrack-layout-detail.component';
import { RacetrackLayoutUpdateComponent } from './racetrack-layout-update.component';
import { RacetrackLayoutDeletePopupComponent, RacetrackLayoutDeleteDialogComponent } from './racetrack-layout-delete-dialog.component';
import { racetrackLayoutRoute, racetrackLayoutPopupRoute } from './racetrack-layout.route';

const ENTITY_STATES = [...racetrackLayoutRoute, ...racetrackLayoutPopupRoute];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    RacetrackLayoutDetailComponent,
    RacetrackLayoutUpdateComponent,
    RacetrackLayoutDeleteDialogComponent,
    RacetrackLayoutDeletePopupComponent
  ]
})
export class MotorsportsDatabaseRacetrackLayoutModule {}
