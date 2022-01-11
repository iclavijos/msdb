import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventSessionComponent } from './list/event-session.component';
import { EventSessionDetailComponent } from './detail/event-session-detail.component';
import { EventSessionUpdateComponent } from './update/event-session-update.component';
import { EventSessionDeleteDialogComponent } from './delete/event-session-delete-dialog.component';
import { EventSessionRoutingModule } from './route/event-session-routing.module';

@NgModule({
    imports: [SharedModule, EventSessionRoutingModule],
    declarations: [EventSessionComponent, EventSessionDetailComponent, EventSessionUpdateComponent, EventSessionDeleteDialogComponent]
})
export class EventSessionModule {}
