import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PointsSystemComponent } from './list/points-system.component';
import { PointsSystemDetailComponent } from './detail/points-system-detail.component';
import { PointsSystemUpdateComponent } from './update/points-system-update.component';
import { PointsSystemDeleteDialogComponent } from './delete/points-system-delete-dialog.component';
import { PointsSystemRoutingModule } from './route/points-system-routing.module';

@NgModule({
  imports: [SharedModule, PointsSystemRoutingModule],
  declarations: [PointsSystemComponent, PointsSystemDetailComponent, PointsSystemUpdateComponent, PointsSystemDeleteDialogComponent],
  entryComponents: [PointsSystemDeleteDialogComponent],
})
export class PointsSystemModule {}
