import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseEventEntryModule } from '../event-entry/event-entry.module';
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
    EventEditionCopyEntriesDialogComponent,
    EventEditionCopyEntriesPopupComponent,
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
        MotorsportsDatabaseEventEntryModule,
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
        EventEditionCopyEntriesDialogComponent,
        EventEditionCopyEntriesPopupComponent,
    ],
    entryComponents: [
        EventEditionComponent,
        EventEditionDialogComponent,
        EventEditionPopupComponent,
        EventEditionDeleteDialogComponent,
        EventEditionDeletePopupComponent,
        EventEditionCopyEntriesDialogComponent,
        EventEditionCopyEntriesPopupComponent,
    ],
    providers: [
        EventEditionService,
        EventEditionPopupService,
        EventEditionResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEventEditionModule {}
