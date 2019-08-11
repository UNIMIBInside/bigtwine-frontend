import { OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import {
    ActionTypes,
    AnalysisInputType,
    AnalysisState,
    AnalysisStatus,
    AnalysisType,
    GetAnalysis,
    IAnalysis,
    selectCurrentAnalysis,
    selectLastError
} from 'app/analysis';
import { first, take, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

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

    abstract get analysisType(): AnalysisType;
    abstract get analysisInputType(): AnalysisInputType;

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

        this.currentAnalysis$.pipe(takeUntil(this.destroyed$)).subscribe((analysis: IAnalysis) => {
            this.onCurrentAnalysisChange(analysis);
        });

        this.lastError$.pipe(first(e => e && e.type === ActionTypes.GetAnalysisError)).subscribe(e => {
            this.router
                .navigate([`/analysis/${this.analysisType}/${this.analysisInputType}/new`])
                .catch(err => console.error(err));
        });

        this.route.paramMap.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.onRouteAnalysisIdChange(params.get('analysisId'));
        });

        this.onRouteAnalysisIdChange(this.route.snapshot.params.analysisId);
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
            } else {
                this.stopListenResults(analysis);
                if (analysis.status === AnalysisStatus.Completed) {
                    this.fetchFirstResultsPage();
                }
            }
        } else {
            this.stopListenResults(analysis);
        }
    }

    abstract startListenResults(analysis: IAnalysis);
    abstract stopListenResults(analysis?: IAnalysis);

    fetchFirstResultsPage() {
        this.fetchResultsPage(1);
    }

    abstract fetchResultsPage(page: number);
}
