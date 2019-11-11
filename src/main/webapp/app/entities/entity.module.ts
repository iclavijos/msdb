import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'category',
        loadChildren: () => import('./category/category.module').then(m => m.MotorsportsDatabaseCategoryModule)
      },
      {
        path: 'chassis',
        loadChildren: () => import('./chassis/chassis.module').then(m => m.MotorsportsDatabaseChassisModule)
      },
      {
        path: 'driver',
        loadChildren: () => import('./driver/driver.module').then(m => m.MotorsportsDatabaseDriverModule)
      },
      {
        path: 'engine',
        loadChildren: () => import('./engine/engine.module').then(m => m.MotorsportsDatabaseEngineModule)
      },
      {
        path: 'event',
        loadChildren: () => import('./event/event.module').then(m => m.MotorsportsDatabaseEventModule)
      },
      {
        path: 'event-edition',
        loadChildren: () => import('./event-edition/event-edition.module').then(m => m.MotorsportsDatabaseEventEditionModule)
      },
      {
        path: 'event-entry',
        loadChildren: () => import('./event-entry/event-entry.module').then(m => m.MotorsportsDatabaseEventEntryModule)
      },
      {
        path: 'event-entry-result',
        loadChildren: () => import('./event-entry-result/event-entry-result.module').then(m => m.MotorsportsDatabaseEventEntryResultModule)
      },
      {
        path: 'event-session',
        loadChildren: () => import('./event-session/event-session.module').then(m => m.MotorsportsDatabaseEventSessionModule)
      },
      {
        path: 'fuel-provider',
        loadChildren: () => import('./fuel-provider/fuel-provider.module').then(m => m.MotorsportsDatabaseFuelProviderModule)
      },
      {
        path: 'points-system',
        loadChildren: () => import('./points-system/points-system.module').then(m => m.MotorsportsDatabasePointsSystemModule)
      },
      {
        path: 'racetrack',
        loadChildren: () => import('./racetrack/racetrack.module').then(m => m.MotorsportsDatabaseRacetrackModule)
      },
      {
        path: 'racetrack-layout',
        loadChildren: () => import('./racetrack-layout/racetrack-layout.module').then(m => m.MotorsportsDatabaseRacetrackLayoutModule)
      },
      {
        path: 'series',
        loadChildren: () => import('./series/series.module').then(m => m.MotorsportsDatabaseSeriesModule)
      },
      {
        path: 'series-edition',
        loadChildren: () => import('./series-edition/series-edition.module').then(m => m.MotorsportsDatabaseSeriesEditionModule)
      },
      {
        path: 'team',
        loadChildren: () => import('./team/team.module').then(m => m.MotorsportsDatabaseTeamModule)
      },
      {
        path: 'driver-points-details',
        loadChildren: () =>
          import('./driver-points-details/driver-points-details.module').then(m => m.MotorsportsDatabaseDriverPointsDetailsModule)
      },
      {
        path: 'tyre-provider',
        loadChildren: () => import('./tyre-provider/tyre-provider.module').then(m => m.MotorsportsDatabaseTyreProviderModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class MotorsportsDatabaseEntityModule {}
