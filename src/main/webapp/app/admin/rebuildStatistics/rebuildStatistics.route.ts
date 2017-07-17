import { Route } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiRebuildStatisticsComponent } from './rebuildStatistics.component';

export const rebuildStatisticsRoute: Route = {
    path: 'rebuildStatistics',
    component: JhiRebuildStatisticsComponent,
    data: {
        pageTitle: 'global.menu.admin.rebuildIndexes'
    }
};
