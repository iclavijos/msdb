import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../shared';

import { HomeComponent, HomeEntriesComponent, HomeEventsComponent, HOME_ROUTE, HomeEntriesPagingParams } from './';


@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot( HOME_ROUTE , { useHash: true })
    ],
    declarations: [
        HomeComponent,
        HomeEntriesComponent,
        HomeEventsComponent
    ],
    entryComponents: [
        HomeComponent,
        HomeEntriesComponent,
        HomeEventsComponent
    ],
    providers: [
        HomeEntriesPagingParams
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseHomeModule {}
