import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RacetrackComponent } from './list/racetrack.component';
import { RacetrackDetailComponent } from './detail/racetrack-detail.component';
import { RacetrackUpdateComponent } from './update/racetrack-update.component';
import { RacetrackDeleteDialogComponent } from './delete/racetrack-delete-dialog.component';
import { RacetrackRoutingModule } from './route/racetrack-routing.module';

@NgModule({
    imports: [SharedModule, RacetrackRoutingModule],
    declarations: [RacetrackComponent, RacetrackDetailComponent, RacetrackUpdateComponent, RacetrackDeleteDialogComponent]
})
export class RacetrackModule {}
