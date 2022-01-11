import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChassisComponent } from './list/chassis.component';
import { ChassisDetailComponent } from './detail/chassis-detail.component';
import { ChassisUpdateComponent } from './update/chassis-update.component';
import { ChassisDeleteDialogComponent } from './delete/chassis-delete-dialog.component';
import { ChassisRoutingModule } from './route/chassis-routing.module';

@NgModule({
    imports: [SharedModule, ChassisRoutingModule],
    declarations: [ChassisComponent, ChassisDetailComponent, ChassisUpdateComponent, ChassisDeleteDialogComponent]
})
export class ChassisModule {}
