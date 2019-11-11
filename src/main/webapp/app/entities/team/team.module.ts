import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { TeamComponent } from './team.component';
import { TeamDetailComponent } from './team-detail.component';
import { TeamUpdateComponent } from './team-update.component';
import { TeamDeletePopupComponent, TeamDeleteDialogComponent } from './team-delete-dialog.component';
import { teamRoute, teamPopupRoute } from './team.route';

const ENTITY_STATES = [...teamRoute, ...teamPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [TeamComponent, TeamDetailComponent, TeamUpdateComponent, TeamDeleteDialogComponent, TeamDeletePopupComponent],
  entryComponents: [TeamDeleteDialogComponent]
})
export class MotorsportsDatabaseTeamModule {}
