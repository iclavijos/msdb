import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared';

import {
    ChassisService,
    ChassisPopupService,
    ChassisComponent,
    ChassisDetailComponent,
    ChassisDialogComponent,
    ChassisPopupComponent,
    ChassisDeletePopupComponent,
    ChassisDeleteDialogComponent,
    chassisRoute,
    chassisPopupRoute,
} from './';

let ENTITY_STATES = [
    ...chassisRoute,
    ...chassisPopupRoute,
];

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        ChassisComponent,
        ChassisDetailComponent,
        ChassisDialogComponent,
        ChassisDeleteDialogComponent,
        ChassisPopupComponent,
        ChassisDeletePopupComponent,
    ],
    entryComponents: [
        ChassisComponent,
        ChassisDialogComponent,
        ChassisPopupComponent,
        ChassisDeleteDialogComponent,
        ChassisDeletePopupComponent,
    ],
    providers: [
        ChassisService,
        ChassisPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseChassisModule {}
