import { Route } from '@angular/router';

import { BtwConfigurationComponent } from './configuration.component';

export const configurationRoute: Route = {
    path: 'btw-configuration',
    component: BtwConfigurationComponent,
    data: {
        pageTitle: 'configuration.title'
    }
};
