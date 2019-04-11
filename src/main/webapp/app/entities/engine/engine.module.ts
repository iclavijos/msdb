import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { MotorsportsDatabaseSharedModule } from 'app/shared';
import {
    EngineComponent,
    EngineDetailComponent,
    EngineUpdateComponent,
    EngineDeletePopupComponent,
    EngineDeleteDialogComponent,
    engineRoute,
    enginePopupRoute
} from './';

const ENTITY_STATES = [...engineRoute, ...enginePopupRoute];

@NgModule({
    imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [EngineComponent, EngineDetailComponent, EngineUpdateComponent, EngineDeleteDialogComponent, EngineDeletePopupComponent],
    entryComponents: [EngineComponent, EngineUpdateComponent, EngineDeleteDialogComponent, EngineDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseEngineModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
