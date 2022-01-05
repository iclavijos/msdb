import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EngineComponent } from './list/engine.component';
import { EngineDetailComponent } from './detail/engine-detail.component';
import { EngineUpdateComponent } from './update/engine-update.component';
import { EngineDeleteDialogComponent } from './delete/engine-delete-dialog.component';
import { EngineRoutingModule } from './route/engine-routing.module';

@NgModule({
  imports: [SharedModule, EngineRoutingModule],
  declarations: [EngineComponent, EngineDetailComponent, EngineUpdateComponent, EngineDeleteDialogComponent],
  entryComponents: [EngineDeleteDialogComponent],
})
export class EngineModule {}
