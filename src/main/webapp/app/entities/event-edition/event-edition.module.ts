import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventEditionComponent } from './list/event-edition.component';
import { EventEditionDetailComponent } from './detail/event-edition-detail.component';
import { EventEditionUpdateComponent } from './update/event-edition-update.component';
import { EventEditionDeleteDialogComponent } from './delete/event-edition-delete-dialog.component';
import { EventEditionRoutingModule } from './route/event-edition-routing.module';

@NgModule({
  imports: [SharedModule, EventEditionRoutingModule],
  declarations: [EventEditionComponent, EventEditionDetailComponent, EventEditionUpdateComponent, EventEditionDeleteDialogComponent],
  entryComponents: [EventEditionDeleteDialogComponent],
})
export class EventEditionModule {}
