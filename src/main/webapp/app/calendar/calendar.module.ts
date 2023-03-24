import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timeLinePlugin from '@fullcalendar/timeline';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import luxon2Plugin from '@fullcalendar/luxon2';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

import { CalendarComponent, EventDialogComponent } from './calendar.component';

import { calendarRoute } from './calendar.route';

// FullCalendarModule.registerPlugins([ // register FullCalendar plugins
//   dayGridPlugin,
//   timeGridPlugin,
//   timeLinePlugin,
//   listPlugin,
//   interactionPlugin,
//   luxon2Plugin,
//   bootstrap5Plugin
// ]);

@NgModule({
  imports: [SharedModule, RouterModule.forChild([calendarRoute])],
  declarations: [CalendarComponent, EventDialogComponent]
})
export class CalendarModule {}
