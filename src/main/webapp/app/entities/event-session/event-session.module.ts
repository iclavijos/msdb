import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared';
import {
    EventSessionService,
    EventSessionPopupService,
    EventSessionComponent,
    EventSessionDialogComponent,
    EventSessionPopupComponent,
    EventSessionDeletePopupComponent,
    EventSessionDeleteDialogComponent,
    eventSessionRoute,
    eventSessionPopupRoute,
} from './';

const ENTITY_STATES = [
    ...eventSessionRoute,
    ...eventSessionPopupRoute,
];

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        EventSessionComponent,
        EventSessionDialogComponent,
        EventSessionDeleteDialogComponent,
        EventSessionPopupComponent,
        EventSessionDeletePopupComponent,
    ],
    entryComponents: [
        EventSessionComponent,
        EventSessionDialogComponent,
        EventSessionPopupComponent,
        EventSessionDeleteDialogComponent,
        EventSessionDeletePopupComponent,
    ],
    providers: [
        EventSessionService,
        EventSessionPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEventSessionModule {}
