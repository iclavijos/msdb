import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TeamComponent } from './list/team.component';
import { TeamDetailComponent } from './detail/team-detail.component';
import { TeamUpdateComponent } from './update/team-update.component';
import { TeamDeleteDialogComponent } from './delete/team-delete-dialog.component';
import { TeamRoutingModule } from './route/team-routing.module';

@NgModule({
  imports: [SharedModule, TeamRoutingModule],
  declarations: [TeamComponent, TeamDetailComponent, TeamUpdateComponent, TeamDeleteDialogComponent],
  entryComponents: [TeamDeleteDialogComponent],
})
export class TeamModule {}
