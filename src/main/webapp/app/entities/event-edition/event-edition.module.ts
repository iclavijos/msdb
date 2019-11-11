import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { EventEditionComponent } from './event-edition.component';
import { EventEditionDetailComponent } from './event-edition-detail.component';
import { EventEditionUpdateComponent } from './event-edition-update.component';
import { EventEditionDeletePopupComponent, EventEditionDeleteDialogComponent } from './event-edition-delete-dialog.component';
import { eventEditionRoute, eventEditionPopupRoute } from './event-edition.route';

const ENTITY_STATES = [...eventEditionRoute, ...eventEditionPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    EventEditionComponent,
    EventEditionDetailComponent,
    EventEditionUpdateComponent,
    EventEditionDeleteDialogComponent,
    EventEditionDeletePopupComponent
  ],
  entryComponents: [EventEditionDeleteDialogComponent]
})
export class MotorsportsDatabaseEventEditionModule {}
