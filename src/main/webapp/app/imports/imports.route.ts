import { Route, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../shared';

import { ImportsComponent } from './imports.component';

export const importDriversRoute: Route = {
    path: 'import/drivers',
    component: ImportsComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'imports.title',
        importType: 'drivers'
    },
    canActivate: [UserRouteAccessService]
};

export const importFuelProvidersRoute: Route = {
    path: 'import/fuelProviders',
    component: ImportsComponent,
    data: {
        authorities: ['ROLE_EDITOR', 'ROLE_ADMIN'],
        pageTitle: 'imports.title',
        type: 'fuelProviders'
    },
    canActivate: [UserRouteAccessService]
};

let IMPORTS_ROUTES = [
   importDriversRoute,
   importFuelProvidersRoute
];

export const importsState: Routes = [{
    path: '',
    children: IMPORTS_ROUTES
}];
