import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Ng2CompleterModule } from 'ng2-completer';

import { MotorsportsDatabaseEventEntryResultModule } from '../event-entry-result/event-entry-result.module';
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

let ENTITY_STATES = [
    ...eventEditionRoute,
    ...eventEditionPopupRoute,
];

@NgModule({
    imports: [
        Ng2CompleterModule,
        MotorsportsDatabaseSharedModule,
        MotorsportsDatabaseEventEntryResultModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    exports: [
        EventEditionComponent
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
