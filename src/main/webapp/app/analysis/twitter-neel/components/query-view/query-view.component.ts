import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ActionTypes, AnalysisState, GetAnalysis, GetAnalysisResults, selectCurrentAnalysis, selectLastError } from 'app/analysis/store';
import { Observable, ReplaySubject } from 'rxjs';
import { IAnalysis, AnalysisStatus } from 'app/analysis';
import { first, take, takeUntil } from 'rxjs/operators';
import { IPaginationInfo, selectPagination, StartListenTwitterNeelResults, StopListenTwitterNeelResults, TwitterNeelState } from 'app/analysis/twitter-neel';

@Component({
  selector: 'btw-query-view',
  templateUrl: './query-view.component.html',
  styleUrls: ['./query-view.component.scss']
})
export class QueryViewComponent implements OnInit, OnDestroy {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    currentAnalysis$: Observable<IAnalysis>;
    lastError$: Observable<any>;

    get currentAnalysis(): IAnalysis {
        let currentAnalysis: IAnalysis = null;
        this.currentAnalysis$
            .pipe(take(1))
            .subscribe((analysis: IAnalysis) => currentAnalysis = analysis);

        return currentAnalysis;
    }

    get paginationInfo(): IPaginationInfo {
        let pagination = null;
        this.tNeelStore
            .select(selectPagination)
            .pipe(take(1))
            .subscribe(p => pagination = p);

        return pagination;
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private analysisStore: Store<AnalysisState>,
        private tNeelStore: Store<TwitterNeelState>
    ) { }

    ngOnInit() {
        this.currentAnalysis$ = this.analysisStore.select(selectCurrentAnalysis);
        this.lastError$ = this.analysisStore.pipe(select(selectLastError));

        this.currentAnalysis$.pipe(takeUntil(this.destroyed$)).subscribe((analysis: IAnalysis) => {
            this.onCurrentAnalysisChange(analysis);
        });

        this.lastError$.pipe(first(e => e && e.type === ActionTypes.GetAnalysisError)).subscribe(e => {
            this.router
                .navigate(['/analysis/twitter-neel/query/new'])
                .catch(err => console.error(err));
        });

        this.route.paramMap.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.onRouteAnalysisIdChange(params.get('analysisId'));
        });

        this.onRouteAnalysisIdChange(this.route.snapshot.params.analysisId);
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    onRouteAnalysisIdChange(analysisId: string) {
        if (analysisId && (!this.currentAnalysis || this.currentAnalysis.id !== analysisId)) {
            this.analysisStore.dispatch(new GetAnalysis(analysisId));
        }
    }

    onCurrentAnalysisChange(analysis: IAnalysis) {
        if (analysis) {
            if (analysis.status === AnalysisStatus.Started) {
                this.startListenResults(analysis);
            } else if (analysis.status === AnalysisStatus.Completed) {
                this.fetchFirstResultsPage();
            } else {
                this.stopListenResults(analysis);
            }
        } else {
            this.stopListenResults(analysis);
        }
    }

    startListenResults(analysis: IAnalysis) {
        this.analysisStore.dispatch(new StartListenTwitterNeelResults(analysis.id));
    }

    stopListenResults(analysis?: IAnalysis) {
        const analysisId = analysis ? analysis.id : null;
        this.analysisStore.dispatch(new StopListenTwitterNeelResults(analysisId));
    }

    fetchFirstResultsPage() {
        this.fetchResultsPage(1);
    }

    fetchResultsPage(page: number) {
        const pageSize = this.paginationInfo.pageSize;
        const action = new GetAnalysisResults(this.currentAnalysis.id, page, pageSize);

        this.analysisStore.dispatch(action);
    }
}
