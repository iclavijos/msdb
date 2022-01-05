import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DriverPointsDetailsComponent } from './list/driver-points-details.component';
import { DriverPointsDetailsDetailComponent } from './detail/driver-points-details-detail.component';
import { DriverPointsDetailsUpdateComponent } from './update/driver-points-details-update.component';
import { DriverPointsDetailsDeleteDialogComponent } from './delete/driver-points-details-delete-dialog.component';
import { DriverPointsDetailsRoutingModule } from './route/driver-points-details-routing.module';

@NgModule({
  imports: [SharedModule, DriverPointsDetailsRoutingModule],
  declarations: [
    DriverPointsDetailsComponent,
    DriverPointsDetailsDetailComponent,
    DriverPointsDetailsUpdateComponent,
    DriverPointsDetailsDeleteDialogComponent,
  ],
  entryComponents: [DriverPointsDetailsDeleteDialogComponent],
})
export class DriverPointsDetailsModule {}
