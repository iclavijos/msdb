import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITeam } from '../team.model';
import { TeamService } from '../service/team.service';

@Component({
  templateUrl: './team-delete-dialog.component.html',
})
export class TeamDeleteDialogComponent {
  team?: ITeam;

  constructor(protected teamService: TeamService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.teamService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
