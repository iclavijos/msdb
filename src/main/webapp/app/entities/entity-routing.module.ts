import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'driver',
        data: { pageTitle: 'motorsportsDatabaseApp.driver.home.title' },
        loadChildren: () => import('./driver/driver.module').then(m => m.DriverModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'motorsportsDatabaseApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'chassis',
        data: { pageTitle: 'motorsportsDatabaseApp.chassis.home.title' },
        loadChildren: () => import('./chassis/chassis.module').then(m => m.ChassisModule),
      },
      {
        path: 'engine',
        data: { pageTitle: 'motorsportsDatabaseApp.engine.home.title' },
        loadChildren: () => import('./engine/engine.module').then(m => m.EngineModule),
      },
      {
        path: 'event-session',
        data: { pageTitle: 'motorsportsDatabaseApp.eventSession.home.title' },
        loadChildren: () => import('./event-session/event-session.module').then(m => m.EventSessionModule),
      },
      {
        path: 'fuel-provider',
        data: { pageTitle: 'motorsportsDatabaseApp.fuelProvider.home.title' },
        loadChildren: () => import('./fuel-provider/fuel-provider.module').then(m => m.FuelProviderModule),
      },
      {
        path: 'points-system',
        data: { pageTitle: 'motorsportsDatabaseApp.pointsSystem.home.title' },
        loadChildren: () => import('./points-system/points-system.module').then(m => m.PointsSystemModule),
      },
      {
        path: 'racetrack',
        data: { pageTitle: 'motorsportsDatabaseApp.racetrack.home.title' },
        loadChildren: () => import('./racetrack/racetrack.module').then(m => m.RacetrackModule),
      },
      {
        path: 'racetrack-layout',
        data: { pageTitle: 'motorsportsDatabaseApp.racetrackLayout.home.title' },
        loadChildren: () => import('./racetrack-layout/racetrack-layout.module').then(m => m.RacetrackLayoutModule),
      },
//       {
//         path: 'series',
//         data: { pageTitle: 'motorsportsDatabaseApp.series.home.title' },
//         loadChildren: () => import('./series/series.module').then(m => m.SeriesModule),
//       },
//       {
//         path: 'series-edition',
//         data: { pageTitle: 'motorsportsDatabaseApp.seriesEdition.home.title' },
//         loadChildren: () => import('./series-edition/series-edition.module').then(m => m.SeriesEditionModule),
//       },
      {
        path: 'team',
        data: { pageTitle: 'motorsportsDatabaseApp.team.home.title' },
        loadChildren: () => import('./team/team.module').then(m => m.TeamModule),
      },
      {
        path: 'tyre-provider',
        data: { pageTitle: 'motorsportsDatabaseApp.tyreProvider.home.title' },
        loadChildren: () => import('./tyre-provider/tyre-provider.module').then(m => m.TyreProviderModule),
      },
//       {
//         path: 'event-entry',
//         data: { pageTitle: 'motorsportsDatabaseApp.eventEntry.home.title' },
//         loadChildren: () => import('./event-entry/event-entry.module').then(m => m.EventEntryModule),
//       },

//       {
//         path: 'event-entry-result',
//         data: { pageTitle: 'motorsportsDatabaseApp.eventEntryResult.home.title' },
//         loadChildren: () => import('./event-entry-result/event-entry-result.module').then(m => m.EventEntryResultModule),
//       },
//       {
//         path: 'event-edition',
//         data: { pageTitle: 'motorsportsDatabaseApp.eventEdition.home.title' },
//         loadChildren: () => import('./event-edition/event-edition.module').then(m => m.EventEditionModule),
//       },
//       {
//         path: 'event',
//         data: { pageTitle: 'motorsportsDatabaseApp.event.home.title' },
//         loadChildren: () => import('./event/event.module').then(m => m.EventModule),
//       },

//       {
//         path: 'driver-points-details',
//         data: { pageTitle: 'motorsportsDatabaseApp.driverPointsDetails.home.title' },
//         loadChildren: () => import('./driver-points-details/driver-points-details.module').then(m => m.DriverPointsDetailsModule),
//       },

      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
