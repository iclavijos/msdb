import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { CalendarComponent, EventDialogComponent } from './calendar.component';

import { calendarRoute } from './calendar.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([calendarRoute])],
  declarations: [CalendarComponent, EventDialogComponent]
})
export class CalendarModule {}
