import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';

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
        MotorsportsDatabaseSharedLibsModule
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
        JhiAlertErrorComponent
    ]
})
export class MotorsportsDatabaseSharedCommonModule {}
