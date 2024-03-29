import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
  imports: [
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: 'configuration',
        loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule)
      },
      {
        path: 'docs',
        loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule)
      },
      {
        path: 'health',
        loadChildren: () => import('./health/health.module').then(m => m.HealthModule)
      },
      {
        path: 'logs',
        loadChildren: () => import('./logs/logs.module').then(m => m.LogsModule)
      },
      {
        path: 'metrics',
        loadChildren: () => import('./metrics/metrics.module').then(m => m.MetricsModule)
      },
      {
        path: 'rebuildIndexes',
        loadChildren: () => import('./rebuildIndexes/rebuildIndexes.module').then(m => m.RebuildIndexesModule)
      },
      {
        path: 'rebuildStatistics',
        loadChildren: () => import('./rebuildStatistics/rebuildStatistics.module').then(m => m.RebuildStatisticsModule)
      },
      {
        path: 'rebuildSessionsNotifications',
        loadChildren: () =>
          import('./rebuildSessionsNotifications/rebuildSessionsNotifications.module').then(m => m.RebuildSessionsNotificationsModule)
      }
      /* jhipster-needle-add-admin-route - JHipster will add admin routes here */
    ])
  ]
})
export class AdminRoutingModule {}
