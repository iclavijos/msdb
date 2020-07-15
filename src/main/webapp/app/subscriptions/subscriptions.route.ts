import { Route } from '@angular/router';

import { SubscriptionsComponent } from './subscriptions.component';

export const SUBSCRIPTIONS_ROUTE: Route = {
  path: '',
  component: SubscriptionsComponent,
  data: {
    pageTitle: 'motorsportsDatabaseApp.subscriptions.title'
  }
};
