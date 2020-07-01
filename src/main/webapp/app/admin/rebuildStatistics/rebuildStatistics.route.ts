import { Route } from '@angular/router';

import { JhiRebuildStatisticsComponent } from './rebuildStatistics.component';

export const rebuildStatisticsRoute: Route = {
  path: '',
  component: JhiRebuildStatisticsComponent,
  data: {
    pageTitle: 'global.menu.admin.rebuildStatistics'
  }
};
