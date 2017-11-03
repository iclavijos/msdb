import { NgModule, LOCALE_ID } from '@angular/core';
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
        Title,
        {
            provide: LOCALE_ID,
            useValue: 'en'
        },
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
