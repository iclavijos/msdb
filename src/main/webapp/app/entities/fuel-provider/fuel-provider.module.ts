import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared/shared.module';
import { FuelProviderComponent } from './fuel-provider.component';
import { FuelProviderDetailComponent } from './fuel-provider-detail.component';
import { FuelProviderUpdateComponent } from './fuel-provider-update.component';
import { FuelProviderDeletePopupComponent, FuelProviderDeleteDialogComponent } from './fuel-provider-delete-dialog.component';
import { fuelProviderRoute, fuelProviderPopupRoute } from './fuel-provider.route';

const ENTITY_STATES = [...fuelProviderRoute, ...fuelProviderPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    FuelProviderComponent,
    FuelProviderDetailComponent,
    FuelProviderUpdateComponent,
    FuelProviderDeleteDialogComponent,
    FuelProviderDeletePopupComponent
  ]
})
export class MotorsportsDatabaseFuelProviderModule {}
