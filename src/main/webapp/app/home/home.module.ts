import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { HomeEventsComponent } from './home-events.component';
import { HomeEphemerisComponent } from './home-ephemeris.component';
import { HomeEphemerisYearFilter } from './home-ephemeris-year-filter.pipe';
import { HomeEventsDayFilter } from './home-events-day-filter.pipe';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [
    HomeComponent,
    HomeEventsComponent,
    HomeEphemerisComponent,
    HomeEphemerisYearFilter,
    HomeEventsDayFilter
  ]
})
export class HomeModule {}
