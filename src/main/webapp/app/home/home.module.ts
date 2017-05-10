import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../shared';

import { HomeComponent, HomeEntriesComponent, HOME_ROUTE, HomeEntriesPagingParams } from './';


@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot( HOME_ROUTE , { useHash: true })
    ],
    declarations: [
        HomeComponent,
        HomeEntriesComponent
    ],
    entryComponents: [
        HomeComponent,
        HomeEntriesComponent
    ],
    providers: [
        HomeEntriesPagingParams
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseHomeModule {}
