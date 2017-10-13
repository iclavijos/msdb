import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import {
    MotorsportsDatabaseSharedLibsModule,
    JhiLanguageHelper,
    TimeMaskPipe,
    RacetrackLengthPipe,
    DynamicDatePipe,
    EventEntryCategoryFilter,
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent
} from './';

@NgModule({
    imports: [
        MotorsportsDatabaseSharedLibsModule,
        RouterModule
    ],
    declarations: [
        TimeMaskPipe,
        RacetrackLengthPipe,
        DynamicDatePipe,
        EventEntryCategoryFilter,
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent
    ],
    providers: [
        JhiLanguageHelper,
        Title
    ],
    exports: [
        MotorsportsDatabaseSharedLibsModule,
        TimeMaskPipe,
        RacetrackLengthPipe,
        DynamicDatePipe,
        EventEntryCategoryFilter,
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        RouterModule
    ]
})
export class MotorsportsDatabaseSharedCommonModule {}
