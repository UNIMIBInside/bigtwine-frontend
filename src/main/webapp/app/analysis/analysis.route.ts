import { Routes } from '@angular/router';
import { AnalysisHomeComponent } from 'app/analysis/components/analysis-home/analysis-home.component';

export const analysisState: Routes = [
    {
        path: 'analysis',
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: AnalysisHomeComponent
            },
            {
                path: 'twitter-neel',
                loadChildren: './twitter-neel/twitter-neel.module#TwitterNeelModule'
                // children: twitterNeelState
            }
        ]
    },
];
