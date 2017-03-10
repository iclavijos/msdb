import { Route, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../shared';

import { ImportsComponent } from './imports.component';

export const importDriversRoute: Route = {
    path: 'import/drivers',
    component: ImportsComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'imports.title',
        importType: 'DRIVERS'
    },
    canActivate: [UserRouteAccessService]
};

export const importRacetracksRoute: Route = {
    path: 'import/racetracks',
    component: ImportsComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'imports.title',
        importType: 'RACETRACKS'
    },
    canActivate: [UserRouteAccessService]
};

export const importPointsSystemRoute: Route = {
    path: 'import/pointsSystem',
    component: ImportsComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'imports.title',
        importType: 'POINTSSYSTEM'
    },
    canActivate: [UserRouteAccessService]
};

export const importTyreProvidersRoute: Route = {
    path: 'import/tyreProviders',
    component: ImportsComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'imports.title',
        importType: 'TYREPROVIDERS'
    },
    canActivate: [UserRouteAccessService]
};

export const importFuelProvidersRoute: Route = {
    path: 'import/fuelProviders',
    component: ImportsComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'imports.title',
        importType: 'FUELPROVIDERS'
    },
    canActivate: [UserRouteAccessService]
};

let IMPORTS_ROUTES = [
   importDriversRoute,
   importRacetracksRoute,
   importPointsSystemRoute,
   importTyreProvidersRoute,
   importFuelProvidersRoute
];

export const importsState: Routes = [{
    path: '',
    children: IMPORTS_ROUTES
}];
