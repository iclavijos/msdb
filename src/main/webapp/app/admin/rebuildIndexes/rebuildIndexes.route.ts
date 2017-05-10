import { Route } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiRebuildIndexesComponent } from './rebuildIndexes.component';

export const rebuildIndexesRoute: Route = {
    path: 'rebuildIndexes',
    component: JhiRebuildIndexesComponent,
    data: {
        pageTitle: 'global.menu.admin.rebuildIndexes'
    }
};
