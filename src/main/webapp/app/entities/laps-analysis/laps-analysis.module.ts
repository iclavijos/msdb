import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared/shared.module';
import { LapsAnalysisComponent } from './laps-analysis.component';
import { RaceDataComponent } from './race-data.component';
import { lapsAnalysisRoute } from './laps-analysis.route';

import { ChartModule } from 'primeng-lts/chart';
import { CheckboxModule } from 'primeng-lts/checkbox';

import 'chart.js/dist/Chart.min.js';

const ENTITY_STATES = [...lapsAnalysisRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, ChartModule, CheckboxModule, RouterModule.forChild(ENTITY_STATES)],
  exports: [LapsAnalysisComponent, RaceDataComponent],
  declarations: [LapsAnalysisComponent, RaceDataComponent],
  providers: []
})
export class MotorsportsDatabaseLapsAnalysisModule {}
