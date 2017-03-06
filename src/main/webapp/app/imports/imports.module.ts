import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../shared';

import {
    importsState,
    ImportsComponent,
    ImportsService
} from './';

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(importsState, { useHash: true })
    ],
    declarations: [
        ImportsComponent
    ],
    providers: [
        ImportsService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseImportsModule {}
