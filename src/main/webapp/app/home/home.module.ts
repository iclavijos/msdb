import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { HomeEventsComponent } from './home-events.component';
import { HomeEphemerisComponent } from './home-ephemeris.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent, HomeEventsComponent, HomeEphemerisComponent]
})
export class HomeModule {}
