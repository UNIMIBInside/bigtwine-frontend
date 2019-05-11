import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BigtwineSharedModule} from 'app/shared';
import {RouterModule} from '@angular/router';
import {AgmCoreModule} from '@agm/core';
import {AgmJsMarkerClustererModule} from '@agm/js-marker-clusterer';

import {
    twitterNeelState,
    DocumentToolbarComponent,
    DocumentUploadComponent,
    DocumentViewComponent,
    ListResultsViewerComponent,
    MapResultsViewerComponent,
    QueryNewComponent,
    QueryToolbarComponent,
    QueryViewComponent
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
      QueryViewComponent
  ],
  imports: [
      CommonModule,
      BigtwineSharedModule,
      RouterModule.forChild(twitterNeelState),
      AgmCoreModule,
      AgmJsMarkerClustererModule
  ]
})
export class TwitterNeelModule { }
