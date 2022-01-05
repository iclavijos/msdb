import { Route } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { SubscriptionsComponent } from './subscriptions.component';

export const SUBSCRIPTIONS_ROUTE: Route = {
  path: '',
  component: SubscriptionsComponent,
  data: {
    authorities: ['ROLE_USER'],
    pageTitle: 'motorsportsDatabaseApp.subscriptions.title'
  },
  canActivate: [UserRouteAccessService]
};
