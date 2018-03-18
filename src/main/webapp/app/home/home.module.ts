import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../shared';

import { HomeComponent, HomeEntriesComponent, HomeEventsComponent, HOME_ROUTE, HomeEntriesResolvePagingParams } from './';

import { TimezonePickerModule } from 'ng2-timezone-selector';

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot( HOME_ROUTE , { useHash: true }),
        TimezonePickerModule
    ],
    declarations: [
        HomeComponent,
        HomeEntriesComponent,
        HomeEventsComponent
    ],
    entryComponents: [
        HomeComponent,
        HomeEntriesComponent,
        HomeEventsComponent
    ],
    providers: [
        HomeEntriesResolvePagingParams
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseHomeModule {}
