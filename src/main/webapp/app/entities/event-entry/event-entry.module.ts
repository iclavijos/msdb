import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventEntryComponent } from './list/event-entry.component';
import { EventEntryUpdateComponent } from './update/event-entry-update.component';
import { EventEntryDeleteDialogComponent } from './delete/event-entry-delete-dialog.component';
import { EventEntryRoutingModule } from './route/event-entry-routing.module';

@NgModule({
    imports: [SharedModule, EventEntryRoutingModule],
    declarations: [EventEntryComponent, EventEntryUpdateComponent, EventEntryDeleteDialogComponent],
    exports: [EventEntryComponent]
})
export class EventEntryModule {}
