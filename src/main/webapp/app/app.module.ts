import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import './vendor';
import { MotorsportsDatabaseSharedModule } from './shared/shared.module';
import { MotorsportsDatabaseCoreModule } from './core/core.module';
import { MotorsportsDatabaseAppRoutingModule } from './app-routing.module';
import { MotorsportsDatabaseHomeModule } from './home/home.module';
import { MotorsportsDatabaseEntityModule } from './entities/entity.module';
import { MotorsportsDatabaseLegalModule } from './legal/legal.module';
// import { MotorsportsDatabaseImportsModule } from './imports/imports.module';
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
    BrowserAnimationsModule,
    MotorsportsDatabaseSharedModule,
    MotorsportsDatabaseCoreModule,
    MotorsportsDatabaseHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    MotorsportsDatabaseEntityModule,
    MotorsportsDatabaseLegalModule,
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
  providers: [Title],
  bootstrap: [JhiMainComponent]
})
export class MotorsportsDatabaseAppModule {}
