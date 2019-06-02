import { NgModule } from '@angular/core';
import { BigtwineSharedModule } from 'app/shared';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';

import { analysisState } from './';
import { AnalysisReducer, AnalysisEffects } from './store';
import { rxStompConfigFactory } from './config/rx-stomp.config.provider';
import { AuthServerProvider, WindowRef } from 'app/core';

@NgModule({
    imports: [
        BigtwineSharedModule,
        RouterModule.forChild(analysisState),
        StoreModule.forFeature('analysis', AnalysisReducer),
        EffectsModule.forFeature([AnalysisEffects])
    ],
    declarations: [],
    providers: [
        {
            provide: InjectableRxStompConfig,
            useFactory: rxStompConfigFactory,
            deps: [AuthServerProvider, WindowRef]
        },
        {
            provide: RxStompService,
            useFactory: rxStompServiceFactory,
            deps: [InjectableRxStompConfig]
        },
    ]
})
export class BigtwineAnalysisModule { }
