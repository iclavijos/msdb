import { NgModule, Sanitizer } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TranslateService } from 'ng2-translate';
import { AlertService } from 'ng-jhipster';

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


export function alertServiceProvider(sanitizer: Sanitizer, translateService: TranslateService) {
    // set below to true to make alerts look like toast
    let isToast = true;
    return new AlertService(sanitizer, isToast, translateService);
}

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
        {
            provide: AlertService,
            useFactory: alertServiceProvider,
            deps: [Sanitizer, TranslateService]
        },
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
