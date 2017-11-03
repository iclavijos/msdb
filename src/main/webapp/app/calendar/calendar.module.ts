import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import "fullcalendar";
import { ScheduleModule, DialogModule } from 'primeng/primeng';

import { MotorsportsDatabaseSharedModule } from '../shared';

require('style-loader!fullcalendar/dist/fullcalendar.css');

import {
    calendarState,
    Calendar
} from './';

@NgModule({
    imports: [
        ScheduleModule,
        DialogModule,
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(calendarState, { useHash: true })
    ],
    declarations: [
        Calendar
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseCalendarModule {}