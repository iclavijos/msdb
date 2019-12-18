import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared';

import { ChartModule, CheckboxModule } from 'primeng/primeng';

import 'chart.js/dist/Chart.min.js';

import { StandingsComponent } from './';

const ENTITY_STATES = [];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, ChartModule, CheckboxModule, RouterModule.forRoot(ENTITY_STATES, { useHash: true })],
  exports: [StandingsComponent],
  declarations: [StandingsComponent],
  entryComponents: [StandingsComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseStandingsModule {}
