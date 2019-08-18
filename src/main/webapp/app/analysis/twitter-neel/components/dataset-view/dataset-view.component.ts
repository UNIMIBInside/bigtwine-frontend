import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AnalysisInputType, AnalysisState, AnalysisType } from 'app/analysis';
import { TwitterNeelState } from 'app/analysis/twitter-neel';
import { TwitterNeelAnalysisViewComponent } from 'app/analysis/twitter-neel/components/twitterneel-analysisview.component';

@Component({
  selector: 'btw-dataset-view',
  templateUrl: './dataset-view.component.html',
  styleUrls: ['./dataset-view.component.scss']
})
export class DatasetViewComponent extends TwitterNeelAnalysisViewComponent implements OnInit {

    get analysisInputType(): AnalysisInputType {
        return AnalysisInputType.Dataset;
    }

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected analysisStore: Store<AnalysisState>,
        protected tNeelStore: Store<TwitterNeelState>
    ) {
        super(router, route, analysisStore);
    }

  ngOnInit() {
        super.ngOnInit();
  }

}
