import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Ng2CompleterModule } from 'ng2-completer';

import { MotorsportsDatabaseSharedModule } from '../../shared';

import {
    EventEntryService,
    EventEntryPopupService,
    EventEntryDetailComponent,
    EventEntryDialogComponent,
    EventEntryPopupComponent,
    EventEntryDeletePopupComponent,
    EventEntryDeleteDialogComponent,
    eventEntryRoute,
    eventEntryPopupRoute,
} from './';

let ENTITY_STATES = [
    ...eventEntryRoute,
    ...eventEntryPopupRoute,
];

@NgModule({
    imports: [
        Ng2CompleterModule,
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        EventEntryDetailComponent,
        EventEntryDialogComponent,
        EventEntryDeleteDialogComponent,
        EventEntryPopupComponent,
        EventEntryDeletePopupComponent,
    ],
    entryComponents: [
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
