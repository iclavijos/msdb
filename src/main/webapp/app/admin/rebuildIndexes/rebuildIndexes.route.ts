import { Route } from '@angular/router';

import { JhiRebuildIndexesComponent } from './rebuildIndexes.component';

export const rebuildIndexesRoute: Route = {
  path: '',
  component: JhiRebuildIndexesComponent,
  data: {
    pageTitle: 'global.menu.admin.rebuildIndexes'
  }
};
