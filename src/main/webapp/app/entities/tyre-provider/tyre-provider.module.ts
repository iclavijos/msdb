import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TyreProviderComponent } from './list/tyre-provider.component';
import { TyreProviderDetailComponent } from './detail/tyre-provider-detail.component';
import { TyreProviderUpdateComponent } from './update/tyre-provider-update.component';
import { TyreProviderDeleteDialogComponent } from './delete/tyre-provider-delete-dialog.component';
import { TyreProviderRoutingModule } from './route/tyre-provider-routing.module';

@NgModule({
  imports: [SharedModule, TyreProviderRoutingModule],
  declarations: [TyreProviderComponent, TyreProviderDetailComponent, TyreProviderUpdateComponent, TyreProviderDeleteDialogComponent],
  entryComponents: [TyreProviderDeleteDialogComponent],
})
export class TyreProviderModule {}
