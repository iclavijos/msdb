import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared/shared.module';
import { TyreProviderComponent } from './tyre-provider.component';
import { TyreProviderDetailComponent } from './tyre-provider-detail.component';
import { TyreProviderUpdateComponent } from './tyre-provider-update.component';
import { TyreProviderDeletePopupComponent, TyreProviderDeleteDialogComponent } from './tyre-provider-delete-dialog.component';
import { tyreProviderRoute, tyreProviderPopupRoute } from './tyre-provider.route';

const ENTITY_STATES = [...tyreProviderRoute, ...tyreProviderPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TyreProviderComponent,
    TyreProviderDetailComponent,
    TyreProviderUpdateComponent,
    TyreProviderDeleteDialogComponent,
    TyreProviderDeletePopupComponent
  ],
  entryComponents: [TyreProviderDeleteDialogComponent]
})
export class MotorsportsDatabaseTyreProviderModule {}
