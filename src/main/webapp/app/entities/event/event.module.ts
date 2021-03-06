import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { EventComponent } from './event.component';
import { EventDetailComponent } from './event-detail.component';
import { EventUpdateComponent } from './event-update.component';
import { EventDeletePopupComponent, EventDeleteDialogComponent } from './event-delete-dialog.component';
import { eventRoute, eventPopupRoute } from './event.route';

import { MotorsportsDatabaseEventEditionModule } from '../event-edition/event-edition.module';

const ENTITY_STATES = [...eventRoute, ...eventPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, MotorsportsDatabaseEventEditionModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [EventComponent, EventDetailComponent, EventUpdateComponent, EventDeleteDialogComponent, EventDeletePopupComponent],
  entryComponents: [EventDeleteDialogComponent]
})
export class MotorsportsDatabaseEventModule {}
