import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared';

import { ChartModule, CheckboxModule, SliderModule } from 'primeng/primeng';

import 'chart.js/dist/Chart.min.js';

import {
    LapsAnalysisComponent,
    RaceDataComponent
} from './';

const ENTITY_STATES = [
];

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        ChartModule,
        CheckboxModule,
        SliderModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    exports: [
        LapsAnalysisComponent,
        RaceDataComponent
    ],
    declarations: [
        LapsAnalysisComponent,
        RaceDataComponent
    ],
    entryComponents: [
        LapsAnalysisComponent,
        RaceDataComponent
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseLapsAnalysisModule {}
