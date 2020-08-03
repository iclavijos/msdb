import { NgModule } from '@angular/core';
import { MotorsportsDatabaseSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { JhiAlertComponent } from './alert/alert.component';
import { JhiAlertErrorComponent } from './alert/alert-error.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { StatisticsComponent } from './statistics/statistics.component';
import { RacetrackLengthPipe } from './mask/racetrack-length.pipe';
import { TimeMaskPipe } from './mask/time-mask.pipe';
import { LocalizedDatePipe } from './pipes/localizedDate.pipe';
import { TranslateExtPipe } from './pipes/translateExt.pipe';
import { EventEntryCategoryFilter } from './filters/entry-category-filter.pipe';
import { EphemerisYearFilter } from './filters/ephemeris-year-filter.pipe';
import { MaterialElevationDirective } from './directives/material-elevation.directive';
import { ImagesService } from './services/images.service';
import { ImportsService } from './services/imports.service';

@NgModule({
  imports: [MotorsportsDatabaseSharedLibsModule],
  declarations: [
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    HasAnyAuthorityDirective,
    StatisticsComponent,
    RacetrackLengthPipe,
    TimeMaskPipe,
    LocalizedDatePipe,
    TranslateExtPipe,
    EventEntryCategoryFilter,
    EphemerisYearFilter,
    MaterialElevationDirective
  ],
  exports: [
    MotorsportsDatabaseSharedLibsModule,
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    HasAnyAuthorityDirective,
    StatisticsComponent,
    RacetrackLengthPipe,
    TimeMaskPipe,
    LocalizedDatePipe,
    TranslateExtPipe,
    EventEntryCategoryFilter,
    EphemerisYearFilter,
    MaterialElevationDirective
  ],
  providers: [ImagesService, ImportsService, TimeMaskPipe]
})
export class MotorsportsDatabaseSharedModule {}
