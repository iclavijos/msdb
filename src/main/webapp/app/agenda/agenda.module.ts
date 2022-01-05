import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { AgendaComponent } from './agenda.component';
import { AGENDA_ROUTE } from './agenda.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([AGENDA_ROUTE])],
  declarations: [AgendaComponent]
})
export class MotorsportsDatabaseAgendaModule {}
