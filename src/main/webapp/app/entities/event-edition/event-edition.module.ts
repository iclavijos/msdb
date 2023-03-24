import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventEditionComponent } from './list/event-edition.component';
import { EventEditionDetailComponent } from './detail/event-edition-detail.component';
import { EventEditionUpdateComponent } from './update/event-edition-update.component';
import { EventEditionDeleteDialogComponent } from './delete/event-edition-delete-dialog.component';
import { EventEditionRoutingModule } from './route/event-edition-routing.module';
import { EventEditionRescheduleDialogComponent } from './reschedule/event-edition-reschedule-dialog.component';
import { EventEditionCopyEntriesDialogComponent } from './copy-entries/event-edition-copy-entries-dialog.component';
import { EventEditionCloneDialogComponent } from './clone/event-edition-clone-dialog.component';

import { EventSessionModule } from 'app/entities/event-session/event-session.module';
import { EventEntryModule } from 'app/entities/event-entry/event-entry.module';
import { EventEntryResultModule } from 'app/entities/event-entry-result/event-entry-result.module';
// import { MotorsportsDatabaseStandingsModule } from 'app/entities/standings/standings.module';
// import { MotorsportsDatabaseLapsAnalysisModule } from '../laps-analysis/laps-analysis.module';

@NgModule({
    imports: [
        SharedModule,
        EventEditionRoutingModule,
        EventSessionModule,
        EventEntryModule,
        EventEntryResultModule
    ],
    declarations: [
        EventEditionComponent,
        EventEditionDetailComponent,
        EventEditionUpdateComponent,
        EventEditionDeleteDialogComponent,
        EventEditionCopyEntriesDialogComponent,
        EventEditionCloneDialogComponent,
        EventEditionRescheduleDialogComponent
    ],
    exports: [
        EventEditionComponent
    ]
})
export class EventEditionModule {}
