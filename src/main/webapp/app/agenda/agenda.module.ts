import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MotorsportsDatabaseSharedModule } from '../shared/shared.module';

import { AgendaComponent } from './agenda.component';
import { AGENDA_ROUTE } from './agenda.route';

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild([AGENDA_ROUTE])],
  declarations: [AgendaComponent]
})
export class MotorsportsDatabaseAgendaModule {}
