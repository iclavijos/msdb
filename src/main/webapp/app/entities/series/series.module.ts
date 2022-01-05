import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SeriesComponent } from './list/series.component';
import { SeriesDetailComponent } from './detail/series-detail.component';
import { SeriesUpdateComponent } from './update/series-update.component';
import { SeriesDeleteDialogComponent } from './delete/series-delete-dialog.component';
import { SeriesRoutingModule } from './route/series-routing.module';

@NgModule({
  imports: [SharedModule, SeriesRoutingModule],
  declarations: [SeriesComponent, SeriesDetailComponent, SeriesUpdateComponent, SeriesDeleteDialogComponent],
  entryComponents: [SeriesDeleteDialogComponent],
})
export class SeriesModule {}
