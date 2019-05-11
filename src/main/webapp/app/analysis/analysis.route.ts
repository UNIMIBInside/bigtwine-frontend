import { Routes } from '@angular/router';

export const analysisState: Routes = [
    {
        path: 'analysis',
        children: [
            {
                path: 'twitter-neel',
                loadChildren: './twitter-neel/twitter-neel.module#TwitterNeelModule'
            }
        ]
    },
];
