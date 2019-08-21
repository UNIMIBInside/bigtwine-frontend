import { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { first, take, takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import {
    ActionTypes,
    AnalysisState,
    AnalysisStatus,
    ClearAnalysisResults,
    GetAnalysis,
    GetAnalysisResults,
    IAnalysis,
    selectChangesListeningAnalysisId,
    selectCurrentAnalysis,
    selectLastError,
    selectResultsListeningAnalysisId,
    selectResultsPagination,
    StartListenAnalysisChanges,
    StartListenAnalysisResults,
    StopListenAnalysisChanges,
    StopListenAnalysisResults,
    IPaginationInfo
} from 'app/analysis';

export abstract class AnalysisViewComponent implements OnInit, OnDestroy {
    protected destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

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
        this.analysisStore
            .select(selectResultsPagination)
            .pipe(take(1))
            .subscribe(p => pagination = p);

        return pagination;
    }

    get changesListeningAnalysisId(): string {
        let analysisId = null;
        this.analysisStore
            .select(selectChangesListeningAnalysisId)
            .pipe(take(1))
            .subscribe(aid => analysisId = aid);

        return analysisId;
    }

    get resultsListeningAnalysisId(): string {
        let analysisId = null;
        this.analysisStore
            .select(selectResultsListeningAnalysisId)
            .pipe(take(1))
            .subscribe(aid => analysisId = aid);

        return analysisId;
    }

    abstract get showCreateBtn(): boolean;
    abstract get showStartBtn(): boolean;
    abstract get showStopBtn(): boolean;
    abstract get showCancelBtn(): boolean;
    abstract get showCompleteBtn(): boolean;

    protected constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected analysisStore: Store<AnalysisState>
    ) { }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    ngOnInit() {
        this.currentAnalysis$ = this.analysisStore.select(selectCurrentAnalysis);
        this.lastError$ = this.analysisStore.pipe(select(selectLastError));

        this.currentAnalysis$
            .pipe(takeUntil(this.destroyed$))
            .subscribe((analysis: IAnalysis) => {
                this.onCurrentAnalysisChange(analysis);
            });

        this.lastError$
            .pipe(first(e => e && e.type === ActionTypes.GetAnalysisError))
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                this.handleAnalysisNotFound();
            });

        this.route.paramMap
            .pipe(takeUntil(this.destroyed$))
            .subscribe(params => {
                this.onRouteAnalysisIdChange(params.get('analysisId'));
            });

        this.onRouteAnalysisIdChange(this.route.snapshot.params.analysisId);
    }

    onRouteAnalysisIdChange(analysisId: string) {
        if (analysisId) {
            if (!this.currentAnalysis || this.currentAnalysis.id !== analysisId) {
                this.stopListenAnalysisResults();
                this.clearAnalysisResults();
                this.fetchAnalysis(analysisId);
            }
        } else {
            this.handleAnalysisNotFound();
        }
    }

    onCurrentAnalysisChange(analysis: IAnalysis) {
        if (analysis) {
            this.startListenAnalysisChanges();

            if (analysis.status === AnalysisStatus.Started) {
                this.startListenAnalysisResults();
            } else {
                this.stopListenAnalysisResults();
            }

            if (analysis.status === AnalysisStatus.Completed && !this.paginationInfo.enabled) {
                this.fetchFirstResultsPage();
            }
        } else {
            this.stopListenAnalysisChanges();
            this.stopListenAnalysisResults();
        }
    }

    handleAnalysisNotFound() {
        this.router
            .navigate([`/analysis/not-found`])
            .catch(err => console.error(err));
    }

    fetchFirstResultsPage() {
        this.fetchResultsPage(0);
    }

    fetchResultsPage(page: number) {
        const pageSize = this.paginationInfo.pageSize;
        const action = new GetAnalysisResults(this.currentAnalysis.id, {page, pageSize});

        this.analysisStore.dispatch(action);
    }

    fetchAnalysis(analysisId: string) {
        this.analysisStore.dispatch(new GetAnalysis(analysisId));
    }

    startListenAnalysisResults() {
        if (!this.currentAnalysis || this.resultsListeningAnalysisId === this.currentAnalysis.id) {
            return;
        }

        this.analysisStore.dispatch(new StartListenAnalysisResults(this.currentAnalysis.id));
    }

    stopListenAnalysisResults() {
        const analysisId = this.currentAnalysis ? this.currentAnalysis.id : null;
        this.analysisStore.dispatch(new StopListenAnalysisResults(analysisId));
    }

    startListenAnalysisChanges() {
        if (!this.currentAnalysis || this.changesListeningAnalysisId === this.currentAnalysis.id) {
            return;
        }

        this.analysisStore.dispatch(new StartListenAnalysisChanges(this.currentAnalysis.id));
    }

    stopListenAnalysisChanges() {
        const analysisId = this.currentAnalysis ? this.currentAnalysis.id : null;
        this.analysisStore.dispatch(new StopListenAnalysisChanges(analysisId));
    }

    clearAnalysisResults() {
        this.analysisStore.dispatch(new ClearAnalysisResults());
    }

    protected _checkAnalysisStatus(...statuses: AnalysisStatus[]): boolean {
        return this.currentAnalysis && statuses.indexOf(this.currentAnalysis.status as AnalysisStatus) >= 0;
    }
}
