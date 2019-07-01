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
    DocumentToolbarComponent,
    DocumentUploadComponent,
    DocumentViewComponent,
    ListResultsViewerComponent,
    MapResultsViewerComponent,
    QueryNewComponent,
    QueryToolbarComponent,
    QueryViewComponent,
    QueryInputComponent,
    NeelProcessedTweetComponent,
    HighlightedTweetTextComponent,
    TwitterNeelReducer,
    TwitterNeelEffects,
} from './';
import { TweetEntityHighlighterService } from 'app/analysis/twitter-neel/services/tweet-entity-highlighter.service';

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
        DocumentToolbarComponent,
        DocumentUploadComponent,
        DocumentViewComponent,
        ListResultsViewerComponent,
        MapResultsViewerComponent,
        QueryNewComponent,
        QueryToolbarComponent,
        QueryViewComponent,
        QueryInputComponent,
        NeelProcessedTweetComponent,
        HighlightedTweetTextComponent,
    ],
    providers: [
        {
            provide: TweetEntityHighlighterService,
            useClass: TweetEntityHighlighterService,
        }
    ]
})
export class TwitterNeelModule {
}
