import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Ng2CompleterModule } from 'ng2-completer';

import { PanelModule, AccordionModule, SharedModule } from 'primeng/primeng';

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

let ENTITY_STATES = [
    ...eventEntryRoute,
    ...eventEntryPopupRoute,
];

@NgModule({
    imports: [
        Ng2CompleterModule,
        AccordionModule, 
        SharedModule,
        PanelModule,
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    exports: [
        EventEntryComponent,
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
