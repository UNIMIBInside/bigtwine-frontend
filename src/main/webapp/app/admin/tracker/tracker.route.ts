import { Route } from '@angular/router';

import { BtwTrackerComponent } from './tracker.component';

export const trackerRoute: Route = {
    path: 'btw-tracker',
    component: BtwTrackerComponent,
    data: {
        pageTitle: 'tracker.title'
    }
};
