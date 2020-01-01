import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'driver',
        loadChildren: () => import('./driver/driver.module').then(m => m.MotorsportsDatabaseDriverModule)
      },
      {
        path: 'fuel-provider',
        loadChildren: () => import('./fuel-provider/fuel-provider.module').then(m => m.MotorsportsDatabaseFuelProviderModule)
      },
      {
        path: 'racetrack',
        loadChildren: () => import('./racetrack/racetrack.module').then(m => m.MotorsportsDatabaseRacetrackModule)
      },
      {
        path: 'racetrack-layout',
        loadChildren: () => import('./racetrack-layout/racetrack-layout.module').then(m => m.MotorsportsDatabaseRacetrackLayoutModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class MotorsportsDatabaseEntityModule {}
