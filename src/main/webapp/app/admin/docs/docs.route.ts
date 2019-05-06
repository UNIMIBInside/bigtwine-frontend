import { Route } from '@angular/router';

import { BtwDocsComponent } from './docs.component';

export const docsRoute: Route = {
    path: 'docs',
    component: BtwDocsComponent,
    data: {
        pageTitle: 'global.menu.admin.apidocs'
    }
};
