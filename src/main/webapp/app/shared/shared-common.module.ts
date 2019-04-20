import { NgModule } from '@angular/core';

import {
    MotorsportsDatabaseSharedLibsModule,
    FindLanguageFromKeyPipe,
    JhiAlertComponent,
    JhiAlertErrorComponent,
    TimeMaskPipe,
    RacetrackLengthPipe,
    DynamicDatePipe,
    EventEntryCategoryFilter
} from './';

@NgModule({
    imports: [MotorsportsDatabaseSharedLibsModule],
    declarations: [
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        TimeMaskPipe,
        RacetrackLengthPipe,
        DynamicDatePipe,
        EventEntryCategoryFilter
    ],
    exports: [
        MotorsportsDatabaseSharedLibsModule,
        FindLanguageFromKeyPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        TimeMaskPipe,
        RacetrackLengthPipe,
        DynamicDatePipe,
        EventEntryCategoryFilter
    ]
})
export class MotorsportsDatabaseSharedCommonModule {}
