import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { DriverPointsDetailsComponent } from './driver-points-details.component';
import { DriverPointsDetailsDetailComponent } from './driver-points-details-detail.component';
import { DriverPointsDetailsUpdateComponent } from './driver-points-details-update.component';
import {
  DriverPointsDetailsDeletePopupComponent,
  DriverPointsDetailsDeleteDialogComponent
} from './driver-points-details-delete-dialog.component';
import { driverPointsDetailsRoute, driverPointsDetailsPopupRoute } from './driver-points-details.route';

const ENTITY_STATES = [...driverPointsDetailsRoute, ...driverPointsDetailsPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DriverPointsDetailsComponent,
    DriverPointsDetailsDetailComponent,
    DriverPointsDetailsUpdateComponent,
    DriverPointsDetailsDeleteDialogComponent,
    DriverPointsDetailsDeletePopupComponent
  ],
  entryComponents: [DriverPointsDetailsDeleteDialogComponent]
})
export class MotorsportsDatabaseDriverPointsDetailsModule {}
