import { Route } from '@angular/router';

import { BtwMetricsMonitoringComponent } from './metrics.component';

export const metricsRoute: Route = {
    path: 'btw-metrics',
    component: BtwMetricsMonitoringComponent,
    data: {
        pageTitle: 'metrics.title'
    }
};
