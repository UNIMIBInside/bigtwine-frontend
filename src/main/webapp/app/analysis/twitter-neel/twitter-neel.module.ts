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
    DocumentToolbarComponent,
    DocumentUploadComponent,
    DocumentViewComponent,
    ListResultsViewerComponent,
    MapResultsViewerComponent,
    QueryNewComponent,
    QueryToolbarComponent,
    QueryViewComponent,
    NeelProcessedTweetComponent,
    HighlightedTweetTextComponent,
    TwitterNeelReducer,
    TwitterNeelEffects,
} from './';

@NgModule({
  declarations: [
      DocumentToolbarComponent,
      DocumentUploadComponent,
      DocumentViewComponent,
      ListResultsViewerComponent,
      MapResultsViewerComponent,
      QueryNewComponent,
      QueryToolbarComponent,
      QueryViewComponent,
      NeelProcessedTweetComponent,
      HighlightedTweetTextComponent,
  ],
  imports: [
      CommonModule,
      BigtwineSharedModule,
      RouterModule.forChild(twitterNeelState),
      StoreModule.forFeature('twitterNeel', TwitterNeelReducer),
      EffectsModule.forFeature([TwitterNeelEffects]),
      AgmCoreModule,
      AgmJsMarkerClustererModule
  ]
})
export class TwitterNeelModule { }
