import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BigtwineSharedModule } from 'app/shared';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TagInputModule } from 'ngx-chips';

import {
    twitterNeelState,
    TwitterNeelReducer,
    TwitterNeelEffects,
    AnalysisListComponent,
    DatasetToolbarComponent,
    DatasetUploadComponent,
    DatasetViewComponent,
    ListResultsViewerComponent,
    MapResultsViewerComponent,
    QueryNewComponent,
    QueryToolbarComponent,
    QueryViewComponent,
    QueryInputComponent,
    NeelProcessedTweetComponent,
    HighlightedTweetTextComponent,
    ResultsToolbarComponent,
    NeelProcessedTweetLargeComponent,
} from './';
import { TweetEntityHighlighterService } from 'app/analysis/twitter-neel/services/tweet-entity-highlighter.service';
import { ResultsFilterService } from 'app/analysis/twitter-neel/services/results-filter.service';

@NgModule({
    imports: [
        CommonModule,
        BigtwineSharedModule,
        RouterModule.forChild(twitterNeelState),
        StoreModule.forFeature('twitterNeel', TwitterNeelReducer),
        EffectsModule.forFeature([TwitterNeelEffects]),
        AgmCoreModule,
        AgmJsMarkerClustererModule,
        TagInputModule,
    ],
    declarations: [
        AnalysisListComponent,
        DatasetToolbarComponent,
        DatasetUploadComponent,
        DatasetViewComponent,
        ListResultsViewerComponent,
        MapResultsViewerComponent,
        QueryNewComponent,
        QueryToolbarComponent,
        QueryViewComponent,
        QueryInputComponent,
        NeelProcessedTweetComponent,
        NeelProcessedTweetLargeComponent,
        HighlightedTweetTextComponent,
        ResultsToolbarComponent,
    ],
    providers: [
        {
            provide: TweetEntityHighlighterService,
            useClass: TweetEntityHighlighterService,
        },
        {
            provide: ResultsFilterService,
            useClass: ResultsFilterService,
        },
    ]
})
export class TwitterNeelModule {
}
