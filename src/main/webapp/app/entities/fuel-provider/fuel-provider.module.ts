import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared';
import {
    FuelProviderService,
    FuelProviderPopupService,
    FuelProviderComponent,
    FuelProviderDetailComponent,
    FuelProviderDialogComponent,
    FuelProviderPopupComponent,
    FuelProviderDeletePopupComponent,
    FuelProviderDeleteDialogComponent,
    fuelProviderRoute,
    fuelProviderPopupRoute,
    FuelProviderResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...fuelProviderRoute,
    ...fuelProviderPopupRoute,
];

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        FuelProviderComponent,
        FuelProviderDetailComponent,
        FuelProviderDialogComponent,
        FuelProviderDeleteDialogComponent,
        FuelProviderPopupComponent,
        FuelProviderDeletePopupComponent,
    ],
    entryComponents: [
        FuelProviderComponent,
        FuelProviderDialogComponent,
        FuelProviderPopupComponent,
        FuelProviderDeleteDialogComponent,
        FuelProviderDeletePopupComponent,
    ],
    providers: [
        FuelProviderService,
        FuelProviderPopupService,
        FuelProviderResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseFuelProviderModule {}
