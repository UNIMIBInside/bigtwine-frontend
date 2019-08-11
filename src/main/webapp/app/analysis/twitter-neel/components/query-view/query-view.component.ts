import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ActionTypes, AnalysisState, GetAnalysis, GetAnalysisResults, selectCurrentAnalysis, selectLastError } from 'app/analysis/store';
import { Observable, ReplaySubject } from 'rxjs';
import { IAnalysis, AnalysisStatus, AnalysisType, AnalysisInputType } from 'app/analysis';
import { first, take, takeUntil } from 'rxjs/operators';
import { IPaginationInfo, selectPagination, StartListenTwitterNeelResults, StopListenTwitterNeelResults, TwitterNeelState } from 'app/analysis/twitter-neel';
import { AnalysisViewComponent } from 'app/analysis/components/analysis-view.component';

@Component({
  selector: 'btw-query-view',
  templateUrl: './query-view.component.html',
  styleUrls: ['./query-view.component.scss']
})
export class QueryViewComponent extends AnalysisViewComponent {

    get paginationInfo(): IPaginationInfo {
        let pagination = null;
        this.tNeelStore
            .select(selectPagination)
            .pipe(take(1))
            .subscribe(p => pagination = p);

        return pagination;
    }

    get analysisType(): AnalysisType {
        return AnalysisType.TwitterNeel;
    }

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

    startListenResults(analysis: IAnalysis) {
        this.analysisStore.dispatch(new StartListenTwitterNeelResults(analysis.id));
    }

    stopListenResults(analysis?: IAnalysis) {
        const analysisId = analysis ? analysis.id : null;
        this.analysisStore.dispatch(new StopListenTwitterNeelResults(analysisId));
    }

    fetchResultsPage(page: number) {
        const pageSize = this.paginationInfo.pageSize;
        const action = new GetAnalysisResults(this.currentAnalysis.id, page, pageSize);

        this.analysisStore.dispatch(action);
    }
}
