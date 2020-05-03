import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { EventEditionComponent } from './event-edition.component';
import { EventEditionDetailComponent } from './event-edition-detail.component';
import { EventEditionUpdateComponent } from './event-edition-update.component';
import { EventEditionDeletePopupComponent, EventEditionDeleteDialogComponent } from './event-edition-delete-dialog.component';
import { eventEditionRoute, eventEditionPopupRoute } from './event-edition.route';

import { MotorsportsDatabaseEventSessionModule } from '../event-session/event-session.module';
import { MotorsportsDatabaseEventEntryModule } from '../event-entry/event-entry.module';
import { MotorsportsDatabaseEventEntryResultModule } from '../event-entry-result/event-entry-result.module';

const ENTITY_STATES = [...eventEditionRoute, ...eventEditionPopupRoute];

@NgModule({
  imports: [
    MotorsportsDatabaseSharedModule,
    MotorsportsDatabaseEventSessionModule,
    MotorsportsDatabaseEventEntryModule,
    MotorsportsDatabaseEventEntryResultModule,
    RouterModule.forChild(ENTITY_STATES)
  ],
  declarations: [
    EventEditionComponent,
    EventEditionDetailComponent,
    EventEditionUpdateComponent,
    EventEditionDeleteDialogComponent,
    EventEditionDeletePopupComponent
  ],
  exports: [EventEditionComponent],
  entryComponents: [EventEditionDeleteDialogComponent]
})
export class MotorsportsDatabaseEventEditionModule {}
