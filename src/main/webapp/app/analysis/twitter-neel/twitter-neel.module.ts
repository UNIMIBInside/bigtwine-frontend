import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BigtwineSharedModule } from 'app/shared';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxUploadModule } from '@wkoza/ngx-upload';

import {
    twitterNeelState,
    TwitterNeelReducer,
    TwitterNeelEffects,
    DatasetUploadComponent,
    DatasetViewComponent,
    ListResultsViewerComponent,
    MapResultsViewerComponent,
    QueryNewComponent,
    QueryViewComponent,
    NeelProcessedTweetComponent,
    HighlightedTweetTextComponent,
    NeelProcessedTweetLargeComponent,
} from './';
import { TweetEntityHighlighterService } from 'app/analysis/twitter-neel/services/tweet-entity-highlighter.service';
import { ResultsFilterService } from 'app/analysis/twitter-neel/services/results-filter.service';
import { RESULTS_FILTER_SERVICE } from 'app/analysis/services/results-filter.service';
import { ViewModeSwitcherComponent } from 'app/analysis/twitter-neel/components/view-mode-switcher/view-mode-switcher.component';
import { TwitterNeelHomeComponent } from 'app/analysis/twitter-neel/components/twitter-neel-home/twitter-neel-home.component';
import { AnalysisSharedModule } from 'app/analysis/analysis-shared.module';

@NgModule({
    imports: [
        CommonModule,
        BigtwineSharedModule,
        AnalysisSharedModule.forRoot(),
        RouterModule.forChild(twitterNeelState),
        StoreModule.forFeature('twitterNeel', TwitterNeelReducer),
        EffectsModule.forFeature([TwitterNeelEffects]),
        AgmCoreModule,
        AgmJsMarkerClustererModule,
        NgxUploadModule.forRoot()
    ],
    declarations: [
        TwitterNeelHomeComponent,
        DatasetUploadComponent,
        DatasetViewComponent,
        ListResultsViewerComponent,
        MapResultsViewerComponent,
        QueryNewComponent,
        QueryViewComponent,
        NeelProcessedTweetComponent,
        NeelProcessedTweetLargeComponent,
        HighlightedTweetTextComponent,
        ViewModeSwitcherComponent,
    ],
    providers: [
        {
            provide: TweetEntityHighlighterService,
            useClass: TweetEntityHighlighterService,
        },
        {
            provide: RESULTS_FILTER_SERVICE,
            useClass: ResultsFilterService,
        },
    ]
})
export class TwitterNeelModule {
}
