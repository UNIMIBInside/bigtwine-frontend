import { Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
    AnalysisInputType,
    AnalysisState, AnalysisType, CancelAnalysis,
    CompleteAnalysis, CreateAnalysis,
    IAnalysis,
    IAnalysisInput,
    selectCurrentAnalysis,
    StartAnalysis,
    StartListenAnalysisChanges,
    StopAnalysis,
    StopListenAnalysisChanges
} from 'app/analysis';
import { take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

export abstract class AnalysisToolbarComponent implements OnInit, OnDestroy {
    @Input() mode = 'new';

    currentAnalysis$: Observable<IAnalysis>;
    subscriptions = new Subscription();
    waitingNewAnalysis = false;
    input: IAnalysisInput;

    get currentAnalysis(): IAnalysis {
        let currentAnalysis: IAnalysis = null;
        this.currentAnalysis$
            .pipe(take(1))
            .subscribe((analysis: IAnalysis) => currentAnalysis = analysis);

        return currentAnalysis;
    }

    abstract get supportedAnalysisType(): AnalysisType;

    abstract get supportedInputType(): AnalysisInputType;

    protected constructor(protected router: Router, protected route: ActivatedRoute, protected analysisStore: Store<AnalysisState>) { }

    ngOnInit() {
        this.currentAnalysis$ = this.analysisStore.pipe(select(selectCurrentAnalysis));

        const s1 = this.currentAnalysis$.subscribe((analysis: IAnalysis) => {
            this.onCurrentAnalysisChange(analysis);
        });

        this.subscriptions.add(s1);
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.stopListenAnalysisChanges(this.currentAnalysis);
    }

    onCurrentAnalysisChange(analysis: IAnalysis) {
        if (this.isSupportedAnalysis(analysis)) {
            if (this.mode === 'view') {
                this.input = this.currentAnalysis.input;
                this.startListenAnalysisChanges(this.currentAnalysis);
            }

            if (this.waitingNewAnalysis) {
                this.router
                    .navigate([`/analysis/${this.supportedAnalysisType}/${this.supportedInputType}/view/` + analysis.id])
                    .catch(e => console.error(e));

                this.waitingNewAnalysis = false;
            }
        }
    }

    startAnalysis(analysis: IAnalysis) {
        this.analysisStore.dispatch(new StartAnalysis(analysis.id));
    }

    stopAnalysis(analysis: IAnalysis) {
        this.analysisStore.dispatch(new StopAnalysis(analysis.id));
    }

    completeAnalysis(analysis: IAnalysis) {
        this.analysisStore.dispatch(new CompleteAnalysis(analysis.id));
    }

    cancelAnalysis(analysis: IAnalysis) {
        this.analysisStore.dispatch(new CancelAnalysis(analysis.id));
    }

    startListenAnalysisChanges(analysis: IAnalysis) {
        this.analysisStore.dispatch(new StartListenAnalysisChanges(analysis.id));
    }

    stopListenAnalysisChanges(analysis?: IAnalysis) {
        const analysisId = analysis ? analysis.id : null;
        this.analysisStore.dispatch(new StopListenAnalysisChanges(analysisId));
    }

    isSupportedAnalysis(analysis: IAnalysis) {
        return (analysis && analysis.id &&
            analysis.type === this.supportedAnalysisType &&
            analysis.input.type === this.supportedInputType);
    }

    createAnalysis() {
        const analysis: IAnalysis = {
            type: this.supportedAnalysisType,
            input: this.input,
        };

        this.waitingNewAnalysis = true;
        this.analysisStore.dispatch(new CreateAnalysis(analysis));
    }
}
