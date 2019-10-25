import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BigtwineSharedModule } from 'app/shared';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

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
    LinkedEntityComponent,
    NilEntityComponent,
} from './';
import { TweetEntityHighlighterService } from 'app/analysis/twitter-neel/services/tweet-entity-highlighter.service';
import { ResultsFilterService } from 'app/analysis/twitter-neel/services/results-filter.service';
import { RESULTS_FILTER_SERVICE } from 'app/analysis/services/results-filter.service';
import { ViewModeSwitcherComponent } from 'app/analysis/twitter-neel/components/view-mode-switcher/view-mode-switcher.component';
import { TwitterNeelHomeComponent } from 'app/analysis/twitter-neel/components/twitter-neel-home/twitter-neel-home.component';
import { AnalysisSharedModule } from 'app/analysis/analysis-shared.module';
import { TweetsCounterIconComponent } from './components/tweets-counter-icon/tweets-counter-icon.component';
import { EntityCategoryIconComponent } from './components/entity-category-icon/entity-category-icon.component';
import { ConfidenceIconComponent } from './components/confidence-icon/confidence-icon.component';
import { LinkedEntityDetailsComponent } from './components/linked-entity-details/linked-entity-details.component';

@NgModule({
    imports: [
        CommonModule,
        BigtwineSharedModule,
        AnalysisSharedModule.forRoot(),
        RouterModule.forChild(twitterNeelState),
        StoreModule.forFeature('twitterNeel', TwitterNeelReducer),
        EffectsModule.forFeature([TwitterNeelEffects]),
        AgmCoreModule,
        AgmJsMarkerClustererModule
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
        LinkedEntityComponent,
        NilEntityComponent,
        TweetsCounterIconComponent,
        EntityCategoryIconComponent,
        ConfidenceIconComponent,
        LinkedEntityDetailsComponent,
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
