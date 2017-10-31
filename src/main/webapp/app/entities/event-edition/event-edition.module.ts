import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared';
import {
    EventEditionService,
    EventEditionPopupService,
    EventEditionComponent,
    EventEditionDetailComponent,
    EventEditionDialogComponent,
    EventEditionPopupComponent,
    EventEditionDeletePopupComponent,
    EventEditionDeleteDialogComponent,
    eventEditionRoute,
    eventEditionPopupRoute,
    EventEditionResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...eventEditionRoute,
    ...eventEditionPopupRoute,
];

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        EventEditionComponent,
        EventEditionDetailComponent,
        EventEditionDialogComponent,
        EventEditionDeleteDialogComponent,
        EventEditionPopupComponent,
        EventEditionDeletePopupComponent,
    ],
    entryComponents: [
        EventEditionComponent,
        EventEditionDialogComponent,
        EventEditionPopupComponent,
        EventEditionDeleteDialogComponent,
        EventEditionDeletePopupComponent,
    ],
    providers: [
        EventEditionService,
        EventEditionPopupService,
        EventEditionResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEventEditionModule {}
