import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared';
import {
    EventEntryService,
    EventEntryPopupService,
    EventEntryComponent,
    EventEntryDetailComponent,
    EventEntryDialogComponent,
    EventEntryPopupComponent,
    EventEntryDeletePopupComponent,
    EventEntryDeleteDialogComponent,
    eventEntryRoute,
    eventEntryPopupRoute,
} from './';

const ENTITY_STATES = [
    ...eventEntryRoute,
    ...eventEntryPopupRoute,
];

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        EventEntryComponent,
        EventEntryDetailComponent,
        EventEntryDialogComponent,
        EventEntryDeleteDialogComponent,
        EventEntryPopupComponent,
        EventEntryDeletePopupComponent,
    ],
    entryComponents: [
        EventEntryComponent,
        EventEntryDialogComponent,
        EventEntryPopupComponent,
        EventEntryDeleteDialogComponent,
        EventEntryDeletePopupComponent,
    ],
    providers: [
        EventEntryService,
        EventEntryPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEventEntryModule {}
