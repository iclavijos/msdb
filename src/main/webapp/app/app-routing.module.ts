import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { errorRoute } from './layouts/error/error.route';
import { DEBUG_INFO_ENABLED } from './app.constants';

import { UserRouteAccessService } from './core/auth/user-route-access.service';

const LAYOUT_ROUTES = [...errorRoute];

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: ['ROLE_ADMIN']
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule)
        },
        {
          path: 'calendar',
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule)
        },
        {
          path: 'agenda',
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./agenda/agenda.module').then(m => m.AgendaModule)
        },
//         {
//           path: 'subscriptions',
//           canActivate: [UserRouteAccessService],
//           loadChildren: () => import('./subscriptions/subscriptions.module').then(m => m.MotorsportsDatabaseSubscriptionsModule)
//         },
        {
          path: 'legal',
          loadChildren: () => import('./legal/legal.module').then(m => m.MotorsportsDatabaseLegalModule)
        },
        ...LAYOUT_ROUTES
      ],
      { enableTracing: DEBUG_INFO_ENABLED, relativeLinkResolution: 'legacy' }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
