import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MotorsportsDatabaseSharedModule } from 'app/shared';
import {
    SeriesEditionComponent,
    SeriesEditionDetailComponent,
    SeriesEditionUpdateComponent,
    SeriesEditionDeletePopupComponent,
    SeriesEditionDeleteDialogComponent,
    seriesEditionRoute,
    seriesEditionPopupRoute
} from './';

const ENTITY_STATES = [...seriesEditionRoute, ...seriesEditionPopupRoute];

@NgModule({
    imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        SeriesEditionComponent,
        SeriesEditionDetailComponent,
        SeriesEditionUpdateComponent,
        SeriesEditionDeleteDialogComponent,
        SeriesEditionDeletePopupComponent
    ],
    entryComponents: [
        SeriesEditionComponent,
        SeriesEditionUpdateComponent,
        SeriesEditionDeleteDialogComponent,
        SeriesEditionDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseSeriesEditionModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
