import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { MotorsportsDatabaseCoreModule } from 'app/core/core.module';
import { MotorsportsDatabaseAppRoutingModule } from './app-routing.module';
import { MotorsportsDatabaseHomeModule } from './home/home.module';
import { MotorsportsDatabaseEntityModule } from './entities/entity.module';
// import { MotorsportsDatabaseImportsModule } from './imports/imports.module';
// import { MotorsportsDatabaseCalendarModule } from './calendar/calendar.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { JhiMainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ActiveMenuDirective } from './layouts/navbar/active-menu.directive';
import { ErrorComponent } from './layouts/error/error.component';

@NgModule({
  imports: [
    BrowserModule,
    MotorsportsDatabaseSharedModule,
    MotorsportsDatabaseCoreModule,
    MotorsportsDatabaseHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    MotorsportsDatabaseEntityModule,
    // MotorsportsDatabaseImportsModule,
    // MotorsportsDatabaseCalendarModule,
    MotorsportsDatabaseAppRoutingModule
  ],
  declarations: [
    JhiMainComponent,
    NavbarComponent,
    SidebarComponent,
    ErrorComponent,
    PageRibbonComponent,
    ActiveMenuDirective,
    FooterComponent
  ],
  bootstrap: [JhiMainComponent]
})
export class MotorsportsDatabaseAppModule {}
