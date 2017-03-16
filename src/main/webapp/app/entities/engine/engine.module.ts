import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Ng2CompleterModule } from "ng2-completer";

import { MotorsportsDatabaseSharedModule } from '../../shared';

import {
    EngineService,
    EnginePopupService,
    EngineComponent,
    EngineDetailComponent,
    EngineDialogComponent,
    EnginePopupComponent,
    EngineDeletePopupComponent,
    EngineDeleteDialogComponent,
    engineRoute,
    enginePopupRoute,
    EngineResolvePagingParams,
} from './';

let ENTITY_STATES = [
    ...engineRoute,
    ...enginePopupRoute,
];

@NgModule({
    imports: [
        Ng2CompleterModule,
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        EngineComponent,
        EngineDetailComponent,
        EngineDialogComponent,
        EngineDeleteDialogComponent,
        EnginePopupComponent,
        EngineDeletePopupComponent,
    ],
    entryComponents: [
        EngineComponent,
        EngineDialogComponent,
        EnginePopupComponent,
        EngineDeleteDialogComponent,
        EngineDeletePopupComponent,
    ],
    providers: [
        EngineService,
        EnginePopupService,
        EngineResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEngineModule {}
