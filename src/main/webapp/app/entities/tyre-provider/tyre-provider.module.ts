import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ColorPickerModule } from 'primeng/primeng';

import { MotorsportsDatabaseSharedModule } from '../../shared';
import {
    TyreProviderService,
    TyreProviderPopupService,
    TyreProviderComponent,
    TyreProviderDetailComponent,
    TyreProviderDialogComponent,
    TyreProviderPopupComponent,
    TyreProviderDeletePopupComponent,
    TyreProviderDeleteDialogComponent,
    tyreProviderRoute,
    tyreProviderPopupRoute,
    TyreProviderResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...tyreProviderRoute,
    ...tyreProviderPopupRoute,
];

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        ColorPickerModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        TyreProviderComponent,
        TyreProviderDetailComponent,
        TyreProviderDialogComponent,
        TyreProviderDeleteDialogComponent,
        TyreProviderPopupComponent,
        TyreProviderDeletePopupComponent,
    ],
    entryComponents: [
        TyreProviderComponent,
        TyreProviderDialogComponent,
        TyreProviderPopupComponent,
        TyreProviderDeleteDialogComponent,
        TyreProviderDeletePopupComponent,
    ],
    providers: [
        TyreProviderService,
        TyreProviderPopupService,
        TyreProviderResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseTyreProviderModule {}
