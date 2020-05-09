import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';

import { CalendarComponent, EventDialogComponent } from './calendar.component';

import { calendarRoute } from './calendar.route';

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild([calendarRoute])],
  declarations: [CalendarComponent, EventDialogComponent],
  entryComponents: [EventDialogComponent]
})
export class MotorsportsDatabaseCalendarModule {}
