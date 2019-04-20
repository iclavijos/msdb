import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from 'app/shared';
import { HOME_ROUTE, HomeComponent, HomeEntriesComponent, HomeEventsComponent } from './';

@NgModule({
    imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild([HOME_ROUTE])],
    declarations: [HomeComponent, HomeEntriesComponent, HomeEventsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseHomeModule {}
