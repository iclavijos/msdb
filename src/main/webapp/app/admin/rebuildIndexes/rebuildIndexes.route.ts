import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { JhiRebuildIndexesComponent } from './rebuildIndexes.component';

export const rebuildIndexesRoute: Route = {
  path: 'rebuildIndexes',
  component: JhiRebuildIndexesComponent,
  data: {
    pageTitle: 'global.menu.admin.rebuildIndexes'
  }
};
