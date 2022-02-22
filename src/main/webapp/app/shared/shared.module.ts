import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { TranslateDirective } from './language/translate.directive';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';
import { SortByDirective } from './sort/sort-by.directive';
import { SortDirective } from './sort/sort.directive';
import { ItemCountComponent } from './pagination/item-count.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ImageComponent } from './components/image/image.component';
import { TypeAheadComponent } from './components/typeahead/typeahead.component';
import { RacetrackLengthPipe } from './mask/racetrack-length.pipe';
import { TimeMaskPipe } from './mask/time-mask.pipe';
import { LocalizedDatePipe } from './pipes/localizedDate.pipe';
import { CategoriesFilter } from './filters/categories-filter.pipe';
import { EventEntryCategoryFilter } from './filters/entry-category-filter.pipe';
import { EphemerisYearFilter } from './filters/ephemeris-year-filter.pipe';
import { MaterialElevationDirective } from './directives/material-elevation.directive';
import { ImagesService } from './services/images.service';
import { ImportsService } from './services/imports.service';
import { FullScreenService } from './services/fullscreen.service';

@NgModule({
  imports: [SharedLibsModule, RouterModule],
  declarations: [
    FindLanguageFromKeyPipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    StatisticsComponent,
    FileUploadComponent,
    ImageComponent,
    TypeAheadComponent,
    SortByDirective,
    SortDirective,
    ItemCountComponent,
    RacetrackLengthPipe,
    TimeMaskPipe,
    LocalizedDatePipe,
    CategoriesFilter,
    EventEntryCategoryFilter,
    EphemerisYearFilter,
    MaterialElevationDirective
  ],
  exports: [
    SharedLibsModule,
    FindLanguageFromKeyPipe,
    TranslateDirective,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
    StatisticsComponent,
    FileUploadComponent,
    ImageComponent,
    TypeAheadComponent,
    SortByDirective,
    SortDirective,
    ItemCountComponent,
    RacetrackLengthPipe,
    TimeMaskPipe,
    LocalizedDatePipe,
    CategoriesFilter,
    EventEntryCategoryFilter,
    EphemerisYearFilter,
    MaterialElevationDirective
  ],
  providers: [ImagesService, ImportsService, FullScreenService, TimeMaskPipe]
})
export class SharedModule {}
