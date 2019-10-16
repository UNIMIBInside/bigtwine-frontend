import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BigtwineSharedModule } from 'app/shared';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TagInputModule } from 'ngx-chips';
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
    QueryInputComponent,
    NeelProcessedTweetComponent,
    HighlightedTweetTextComponent,
    ResultsToolbarComponent,
    NeelProcessedTweetLargeComponent,
} from './';
import { TweetEntityHighlighterService } from 'app/analysis/twitter-neel/services/tweet-entity-highlighter.service';
import { ResultsFilterService } from 'app/analysis/twitter-neel/services/results-filter.service';
import { AnalysisToolbarComponent } from 'app/analysis/components/analysis-toolbar/analysis-toolbar.component';
import { RESULTS_FILTER_SERVICE } from 'app/analysis/services/results-filter.service';
import { ViewModeSwitcherComponent } from 'app/analysis/twitter-neel/components/view-mode-switcher/view-mode-switcher.component';
import { DatasetDetailsComponent } from 'app/analysis/twitter-neel/components/dataset-details/dataset-details.component';
import { AnalysisStatusHistoryComponent } from 'app/analysis/components/analysis-status-history/analysis-status-history.component';
import { AnalysisListComponent, AnalysisStatusBadgeComponent, AnalysisInputBadgeComponent } from 'app/analysis/components';
import { TwitterNeelHomeComponent } from 'app/analysis/twitter-neel/components/twitter-neel-home/twitter-neel-home.component';

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
        NgxUploadModule.forRoot()
    ],
    declarations: [
        TwitterNeelHomeComponent,
        AnalysisToolbarComponent,
        AnalysisStatusHistoryComponent,
        AnalysisListComponent,
        DatasetUploadComponent,
        DatasetViewComponent,
        ListResultsViewerComponent,
        MapResultsViewerComponent,
        QueryNewComponent,
        QueryViewComponent,
        QueryInputComponent,
        NeelProcessedTweetComponent,
        NeelProcessedTweetLargeComponent,
        HighlightedTweetTextComponent,
        ResultsToolbarComponent,
        ViewModeSwitcherComponent,
        DatasetDetailsComponent,
        AnalysisStatusBadgeComponent,
        AnalysisInputBadgeComponent,
    ],
    entryComponents: [
        AnalysisStatusHistoryComponent,
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
