import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventSessionComponent } from './list/event-session.component';
import { EventSessionUpdateComponent } from './update/event-session-update.component';
import { EventSessionDeleteDialogComponent } from './delete/event-session-delete-dialog.component';
import { EventSessionRoutingModule } from './route/event-session-routing.module';

@NgModule({
  imports: [SharedModule, EventSessionRoutingModule],
  declarations: [EventSessionComponent, EventSessionUpdateComponent, EventSessionDeleteDialogComponent],
  entryComponents: [EventSessionDeleteDialogComponent],
})
export class EventSessionModule {}
