import { NgModule } from '@angular/core';
import { MotorsportsDatabaseSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { JhiAlertComponent } from './alert/alert.component';
import { JhiAlertErrorComponent } from './alert/alert-error.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { StatisticsComponent } from './statistics/statistics.component';
import { RacetrackLengthPipe } from './mask/racetrack-length.pipe';
import { LocalizedDatePipe } from './pipes/localizedDate.pipe';

@NgModule({
  imports: [MotorsportsDatabaseSharedLibsModule],
  declarations: [
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    HasAnyAuthorityDirective,
    StatisticsComponent,
    RacetrackLengthPipe,
    LocalizedDatePipe
  ],
  exports: [
    MotorsportsDatabaseSharedLibsModule,
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    HasAnyAuthorityDirective,
    StatisticsComponent,
    RacetrackLengthPipe,
    LocalizedDatePipe
  ]
})
export class MotorsportsDatabaseSharedModule {}
