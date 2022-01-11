import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RacetrackLayoutComponent } from './list/racetrack-layout.component';
import { RacetrackLayoutDetailComponent } from './detail/racetrack-layout-detail.component';
import { RacetrackLayoutUpdateComponent } from './update/racetrack-layout-update.component';
import { RacetrackLayoutDeleteDialogComponent } from './delete/racetrack-layout-delete-dialog.component';
import { RacetrackLayoutRoutingModule } from './route/racetrack-layout-routing.module';

@NgModule({
    imports: [SharedModule, RacetrackLayoutRoutingModule],
    declarations: [
        RacetrackLayoutComponent,
        RacetrackLayoutDetailComponent,
        RacetrackLayoutUpdateComponent,
        RacetrackLayoutDeleteDialogComponent,
    ]
})
export class RacetrackLayoutModule {}
