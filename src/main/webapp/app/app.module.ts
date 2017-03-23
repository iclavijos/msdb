import './vendor.ts';

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2Webstorage } from 'ng2-webstorage';

import { MotorsportsDatabaseSharedModule, UserRouteAccessService } from './shared';
import { MotorsportsDatabaseHomeModule } from './home/home.module';
import { MotorsportsDatabaseAdminModule } from './admin/admin.module';
import { MotorsportsDatabaseAccountModule } from './account/account.module';
import { MotorsportsDatabaseEntityModule } from './entities/entity.module';
import { MotorsportsDatabaseImportsModule } from './imports/imports.module';

import { LayoutRoutingModule } from './layouts';
import { customHttpProvider } from './blocks/interceptor/http.provider';
import { PaginationConfig } from './blocks/config/uib-pagination.config';

import {
    JhiMainComponent,
    NavbarComponent,
    FooterComponent,
    ProfileService,
    PageRibbonComponent,
    ActiveMenuDirective,
    ErrorComponent
} from './layouts';


@NgModule({
    imports: [
        BrowserModule,
        LayoutRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-'}),
        MotorsportsDatabaseSharedModule,
        MotorsportsDatabaseHomeModule,
        MotorsportsDatabaseAdminModule,
        MotorsportsDatabaseAccountModule,
        MotorsportsDatabaseEntityModule,
        MotorsportsDatabaseImportsModule,
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        ActiveMenuDirective,
        FooterComponent
    ],
    providers: [
        ProfileService,
        { provide: Window, useValue: window },
        { provide: Document, useValue: document },
        customHttpProvider(),
        PaginationConfig,
        UserRouteAccessService
    ],
    bootstrap: [ JhiMainComponent ]
})
export class MotorsportsDatabaseAppModule {}
