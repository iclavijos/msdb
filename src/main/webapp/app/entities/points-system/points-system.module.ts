import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared/shared.module';
import { PointsSystemComponent } from './points-system.component';
import { PointsSystemDetailComponent } from './points-system-detail.component';
import { PointsSystemUpdateComponent } from './points-system-update.component';
import { PointsSystemDeletePopupComponent, PointsSystemDeleteDialogComponent } from './points-system-delete-dialog.component';
import { pointsSystemRoute, pointsSystemPopupRoute } from './points-system.route';

const ENTITY_STATES = [...pointsSystemRoute, ...pointsSystemPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    PointsSystemComponent,
    PointsSystemDetailComponent,
    PointsSystemUpdateComponent,
    PointsSystemDeleteDialogComponent,
    PointsSystemDeletePopupComponent
  ]
})
export class MotorsportsDatabasePointsSystemModule {}
