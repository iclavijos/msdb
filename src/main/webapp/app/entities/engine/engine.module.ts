import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared/shared.module';
import { EngineComponent } from './engine.component';
import { EngineDetailComponent } from './engine-detail.component';
import { EngineUpdateComponent } from './engine-update.component';
import { EngineDeletePopupComponent, EngineDeleteDialogComponent } from './engine-delete-dialog.component';
import { engineRoute, enginePopupRoute } from './engine.route';

const ENTITY_STATES = [...engineRoute, ...enginePopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [EngineComponent, EngineDetailComponent, EngineUpdateComponent, EngineDeleteDialogComponent, EngineDeletePopupComponent]
})
export class MotorsportsDatabaseEngineModule {}
