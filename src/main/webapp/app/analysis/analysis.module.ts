import { NgModule } from '@angular/core';
import { BigtwineSharedModule } from 'app/shared';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';

import { MockAnalysisService} from './services/mock-analysis.service';
import { AnalysisService} from './services/analysis.service';

import { AuthServerProvider, WindowRef } from 'app/core';
import {
    analysisState,
    AnalysisReducer,
    AnalysisEffects,
    rxStompConfigFactory,
} from './';
import {
    AnalysisHomeComponent,
    AnalysisNotFoundComponent,
    AnalysisSettingsComponent,
    ChoicesOptionComponent,
    NumberOptionComponent,
    TextOptionComponent,
    BooleanOptionComponent,
    OptionWrapperComponent,
    StepperComponent,
} from 'app/analysis/components';

@NgModule({
    imports: [
        BigtwineSharedModule,
        RouterModule.forChild(analysisState),
        StoreModule.forFeature('analysis', AnalysisReducer),
        EffectsModule.forFeature([AnalysisEffects])
    ],
    declarations: [
        AnalysisHomeComponent,
        AnalysisNotFoundComponent,
        AnalysisSettingsComponent,
        ChoicesOptionComponent,
        NumberOptionComponent,
        TextOptionComponent,
        BooleanOptionComponent,
        OptionWrapperComponent,
        StepperComponent,
    ],
    entryComponents: [
        AnalysisSettingsComponent,
    ],
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
        {
            provide: AnalysisService,
            useClass: MockAnalysisService
        },
    ]
})
export class BigtwineAnalysisModule { }
