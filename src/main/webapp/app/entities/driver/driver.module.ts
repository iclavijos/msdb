import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DriverComponent } from './list/driver.component';
import { DriverDetailComponent } from './detail/driver-detail.component';
import { DriverUpdateComponent } from './update/driver-update.component';
import { DriverDeleteDialogComponent } from './delete/driver-delete-dialog.component';
import { DriverRoutingModule } from './route/driver-routing.module';

@NgModule({
  imports: [SharedModule, DriverRoutingModule],
  declarations: [DriverComponent, DriverDetailComponent, DriverUpdateComponent, DriverDeleteDialogComponent],
  entryComponents: [DriverDeleteDialogComponent],
})
export class DriverModule {}
