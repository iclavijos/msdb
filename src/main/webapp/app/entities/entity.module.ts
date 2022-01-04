import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseStandingsModule } from './standings/standings.module';

@NgModule({
  imports: [
    MotorsportsDatabaseStandingsModule,
    RouterModule.forRoot(
      [
//         {
//           path: 'driver',
//           loadChildren: () => import('./driver/driver.module').then(m => m.MotorsportsDatabaseDriverModule)
//         },
//         {
//           path: 'team',
//           loadChildren: () => import('./team/team.module').then(m => m.MotorsportsDatabaseTeamModule)
//         },
//         {
//           path: 'engine',
//           loadChildren: () => import('./engine/engine.module').then(m => m.MotorsportsDatabaseEngineModule)
//         },
//         {
//           path: 'chassis',
//           loadChildren: () => import('./chassis/chassis.module').then(m => m.MotorsportsDatabaseChassisModule)
//         },
//         {
//           path: 'fuel-provider',
//           loadChildren: () => import('./fuel-provider/fuel-provider.module').then(m => m.MotorsportsDatabaseFuelProviderModule)
//         },
        {
          path: 'tyre-provider',
          loadChildren: () => import('./tyre-provider/tyre-provider.module').then(m => m.TyreProviderModule)
        },
//         {
//           path: 'racetrack',
//           loadChildren: () => import('./racetrack/racetrack.module').then(m => m.MotorsportsDatabaseRacetrackModule)
//         },
//         {
//           path: 'racetrack-layout',
//           loadChildren: () => import('./racetrack-layout/racetrack-layout.module').then(m => m.MotorsportsDatabaseRacetrackLayoutModule)
//         },
//         {
//           path: 'category',
//           loadChildren: () => import('./category/category.module').then(m => m.MotorsportsDatabaseCategoryModule)
//         },
//         {
//           path: 'points-system',
//           loadChildren: () => import('./points-system/points-system.module').then(m => m.MotorsportsDatabasePointsSystemModule)
//         },
//         {
//           path: 'event',
//           loadChildren: () => import('./event/event.module').then(m => m.MotorsportsDatabaseEventModule)
//         },
//         {
//           path: 'series',
//           loadChildren: () => import('./series/series.module').then(m => m.MotorsportsDatabaseSeriesModule)
//         },
//         {
//           path: 'laps-analysis',
//           loadChildren: () => import('./laps-analysis/laps-analysis.module').then(m => m.MotorsportsDatabaseLapsAnalysisModule)
//         }
        /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
      ],
      { relativeLinkResolution: 'legacy' }
    )
  ]
})
export class MotorsportsDatabaseEntityModule {}
