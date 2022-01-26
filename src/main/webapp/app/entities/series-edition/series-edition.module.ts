import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SeriesEditionComponent } from './list/series-edition.component';
import { SeriesEditionDetailComponent } from './detail/series-edition-detail.component';
import { SeriesEditionUpdateComponent } from './update/series-edition-update.component';
import { SeriesEditionDeleteDialogComponent } from './delete/series-edition-delete-dialog.component';
import { SeriesEditionRoutingModule } from './route/series-edition-routing.module';

@NgModule({
  imports: [SharedModule, SeriesEditionRoutingModule],
  declarations: [SeriesEditionComponent, SeriesEditionDetailComponent, SeriesEditionUpdateComponent, SeriesEditionDeleteDialogComponent],
  entryComponents: [SeriesEditionDeleteDialogComponent],
})
export class SeriesEditionModule {}
