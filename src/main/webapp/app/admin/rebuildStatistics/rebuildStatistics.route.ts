import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { JhiRebuildStatisticsComponent } from './rebuildStatistics.component';

export const rebuildStatisticsRoute: Route = {
  path: 'rebuildStatistics',
  component: JhiRebuildStatisticsComponent,
  data: {
    pageTitle: 'global.menu.admin.rebuildStatistics'
  }
};
