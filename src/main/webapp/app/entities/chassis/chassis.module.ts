import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { ChassisComponent } from './chassis.component';
import { ChassisDetailComponent } from './chassis-detail.component';
import { ChassisUpdateComponent } from './chassis-update.component';
import { ChassisDeletePopupComponent, ChassisDeleteDialogComponent } from './chassis-delete-dialog.component';
import { chassisRoute, chassisPopupRoute } from './chassis.route';

const ENTITY_STATES = [...chassisRoute, ...chassisPopupRoute];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ChassisComponent,
    ChassisDetailComponent,
    ChassisUpdateComponent,
    ChassisDeleteDialogComponent,
    ChassisDeletePopupComponent
  ]
})
export class MotorsportsDatabaseChassisModule {}
