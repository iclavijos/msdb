import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FuelProviderComponent } from './list/fuel-provider.component';
import { FuelProviderDetailComponent } from './detail/fuel-provider-detail.component';
import { FuelProviderUpdateComponent } from './update/fuel-provider-update.component';
import { FuelProviderDeleteDialogComponent } from './delete/fuel-provider-delete-dialog.component';
import { FuelProviderRoutingModule } from './route/fuel-provider-routing.module';

@NgModule({
  imports: [SharedModule, FuelProviderRoutingModule],
  declarations: [FuelProviderComponent, FuelProviderDetailComponent, FuelProviderUpdateComponent, FuelProviderDeleteDialogComponent],
  entryComponents: [FuelProviderDeleteDialogComponent],
})
export class FuelProviderModule {}
