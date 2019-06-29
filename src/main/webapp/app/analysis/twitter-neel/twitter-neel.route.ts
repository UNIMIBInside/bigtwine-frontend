import { Routes } from '@angular/router';

import {
    QueryNewComponent,
    QueryViewComponent,
    DocumentViewComponent,
    DocumentUploadComponent,
    MapResultsViewerComponent,
    ListResultsViewerComponent
} from './';

const viewerModes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: MapResultsViewerComponent,
        outlet: 'results-viewer'
    },
    {
        path: 'map',
        component: MapResultsViewerComponent,
        outlet: 'results-viewer'
    },
    {
        path: 'list',
        component: ListResultsViewerComponent,
        outlet: 'results-viewer'
    },
];

export const twitterNeelState: Routes = [
    {
        path: 'query',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'new'
            },
            {
                path: 'new',
                component: QueryNewComponent,
            },
            {
                path: 'view/:analysisId',
                component: QueryViewComponent,
                children: viewerModes
            },
        ]
    },
    {
        path: 'document',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'upload'
            },
            {
                path: 'upload',
                component: DocumentUploadComponent,
            },
            {
                path: 'view/:analysisId',
                component: DocumentViewComponent,
                children: viewerModes
            },
        ]
    },
];
