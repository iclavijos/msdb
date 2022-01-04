import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { LapsAnalysisComponent } from './laps-analysis.component';
import { RaceDataComponent } from './race-data.component';
import { lapsAnalysisRoute } from './laps-analysis.route';

import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';

import 'chart.js/dist/Chart.min.js';

const ENTITY_STATES = [...lapsAnalysisRoute];

@NgModule({
  imports: [SharedModule, ChartModule, CheckboxModule, RouterModule.forChild(ENTITY_STATES)],
  exports: [LapsAnalysisComponent, RaceDataComponent],
  declarations: [LapsAnalysisComponent, RaceDataComponent],
  providers: []
})
export class MotorsportsDatabaseLapsAnalysisModule {}
