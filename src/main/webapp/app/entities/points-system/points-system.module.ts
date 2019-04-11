import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MotorsportsDatabaseSharedModule } from 'app/shared';
import {
    PointsSystemComponent,
    PointsSystemDetailComponent,
    PointsSystemUpdateComponent,
    PointsSystemDeletePopupComponent,
    PointsSystemDeleteDialogComponent,
    pointsSystemRoute,
    pointsSystemPopupRoute
} from './';

const ENTITY_STATES = [...pointsSystemRoute, ...pointsSystemPopupRoute];

@NgModule({
    imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PointsSystemComponent,
        PointsSystemDetailComponent,
        PointsSystemUpdateComponent,
        PointsSystemDeleteDialogComponent,
        PointsSystemDeletePopupComponent
    ],
    entryComponents: [
        PointsSystemComponent,
        PointsSystemUpdateComponent,
        PointsSystemDeleteDialogComponent,
        PointsSystemDeletePopupComponent
    ],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabasePointsSystemModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
