import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

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

const ENTITY_STATES = [
    ...engineRoute,
    ...enginePopupRoute,
];

@NgModule({
    imports: [
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
