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

export const importTeamsRoute: Route = {
    path: 'import/teams',
    component: ImportsComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'imports.title',
        importType: 'TEAMS'
    },
    canActivate: [UserRouteAccessService]
};

export const importEnginesRoute: Route = {
    path: 'import/engines',
    component: ImportsComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'imports.title',
        importType: 'ENGINES'
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
   importTeamsRoute,
   importEnginesRoute,
   importTyreProvidersRoute,
   importFuelProvidersRoute
];

export const importsState: Routes = [{
    path: '',
    children: IMPORTS_ROUTES
}];
