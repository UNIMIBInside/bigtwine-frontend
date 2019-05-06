import { Route } from '@angular/router';

import { BtwHealthCheckComponent } from './health.component';

export const healthRoute: Route = {
    path: 'btw-health',
    component: BtwHealthCheckComponent,
    data: {
        pageTitle: 'health.title'
    }
};
