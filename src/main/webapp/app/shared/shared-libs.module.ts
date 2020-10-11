import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgJhipsterModule } from 'ng-jhipster';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
// import { MomentTimezoneModule } from 'angular-moment-timezone';

import { FullCalendarModule } from '@fullcalendar/angular';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatTabsModule,
  MatSelectModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatExpansionModule,
  MatIconModule,
  MatTreeModule,
  MatListModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatRadioModule,
  MatToolbarModule,
  MatSidenavModule,
  MatMenuModule,
  MatGridListModule,
  MatCardModule,
  MatChipsModule,
  MatSlideToggleModule
} from '@angular/material';

import { MatMomentDateModule } from '@angular/material-moment-adapter';

import { ScrollingModule } from '@angular/cdk/scrolling';

import { ColorPickerModule } from 'ngx-color-picker';
import { LightboxModule } from 'ngx-lightbox';

import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';

@NgModule({
  exports: [
    FormsModule,
    CommonModule,
    RouterModule,
    NgbModule,
    NgJhipsterModule,
    InfiniteScrollModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTabsModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatSortModule,
    MatIconModule,
    MatTreeModule,
    MatListModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatGridListModule,
    MatCardModule,
    MatChipsModule,
    MatSlideToggleModule,
    ColorPickerModule,
    LightboxModule,
    FullCalendarModule,
    ScrollingModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    LeafletModule
  ]
})
export class MotorsportsDatabaseSharedLibsModule {}
