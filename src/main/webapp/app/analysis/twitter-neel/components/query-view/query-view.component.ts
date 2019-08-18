import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ActionTypes, AnalysisState, GetAnalysis, GetAnalysisResults, selectCurrentAnalysis, selectLastError } from 'app/analysis/store';
import { Observable, ReplaySubject } from 'rxjs';
import { IAnalysis, AnalysisStatus, AnalysisType, AnalysisInputType } from 'app/analysis';
import { first, take, takeUntil } from 'rxjs/operators';
import { IPaginationInfo, selectPagination, StartListenTwitterNeelResults, StopListenTwitterNeelResults, TwitterNeelState } from 'app/analysis/twitter-neel';
import { AnalysisViewComponent } from 'app/analysis/components/analysis-view.component';
import { TwitterNeelAnalysisViewComponent } from 'app/analysis/twitter-neel/components/twitterneel-analysisview.component';

@Component({
  selector: 'btw-query-view',
  templateUrl: './query-view.component.html',
  styleUrls: ['./query-view.component.scss']
})
export class QueryViewComponent extends TwitterNeelAnalysisViewComponent {

    get analysisInputType(): AnalysisInputType {
        return AnalysisInputType.Query;
    }

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected analysisStore: Store<AnalysisState>,
        protected tNeelStore: Store<TwitterNeelState>
    ) {
        super(router, route, analysisStore);
    }
}
