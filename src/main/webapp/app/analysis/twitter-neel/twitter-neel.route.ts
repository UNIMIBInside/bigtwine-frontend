import { Routes } from '@angular/router';

import {
    QueryNewComponent,
    QueryViewComponent,
    DatasetViewComponent,
    DatasetUploadComponent,
    MapResultsViewerComponent,
    ListResultsViewerComponent, AnalysisListComponent
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
        path: '',
        pathMatch: 'full',
        component: AnalysisListComponent,
    },
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
                component: DatasetUploadComponent,
            },
            {
                path: 'view/:analysisId',
                component: DatasetViewComponent,
                children: viewerModes
            },
        ]
    },
];
