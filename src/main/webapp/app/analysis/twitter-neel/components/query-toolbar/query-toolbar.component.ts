import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
    AnalysisState,
    CompleteAnalysis,
    CreateAnalysis,
    selectCurrentAnalysis,
    StartAnalysis,
    StartListenAnalysisChanges,
    StopAnalysis,
    StopListenAnalysisChanges
} from 'app/analysis/store';
import { Observable, Subscription } from 'rxjs';
import { AnalysisInputType, AnalysisStatus, AnalysisType, IAnalysis } from 'app/analysis';
import { take } from 'rxjs/operators';

@Component({
    selector: 'btw-query-toolbar',
    templateUrl: './query-toolbar.component.html',
    styleUrls: ['./query-toolbar.component.scss']
})
export class QueryToolbarComponent implements OnInit, OnDestroy {

    @Input() mode = 'new';
    private query: string;

    currentAnalysis$: Observable<IAnalysis>;
    subscriptions = new Subscription();
    waitingNewAnalysis = false;

    get currentAnalysis(): IAnalysis {
        let currentAnalysis: IAnalysis = null;
        this.currentAnalysis$
            .pipe(take(1))
            .subscribe((analysis: IAnalysis) => currentAnalysis = analysis);

        return currentAnalysis;
    }

    get showCreateButton() {
        return this.mode === 'new' || (this.currentAnalysis && this.currentAnalysis.query !== this.query);
    }

    get showStartStopButton() {
        return !this.showCreateButton && this.currentAnalysis && this.currentAnalysis.status !== AnalysisStatus.Completed;
    }

    get showCompleteButton() {
        return this.mode === 'view' && this.currentAnalysis && this.currentAnalysis.status === AnalysisStatus.Running;
    }

    constructor(private router: Router, private route: ActivatedRoute, private analysisStore: Store<AnalysisState>) {
    }

    ngOnInit() {
        this.currentAnalysis$ = this.analysisStore.pipe(select(selectCurrentAnalysis));

        const s1 = this.currentAnalysis$.subscribe((analysis: IAnalysis) => {
            this.onCurrentAnalysisChange(analysis);
        });

        this.subscriptions.add(s1);

        if (this.currentAnalysis && this.mode === 'view') {
            this.query = this.currentAnalysis.query;
            this.startListenAnalysisChanges(this.currentAnalysis);
        }
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.stopListenAnalysisChanges(this.currentAnalysis);
    }

    onQueryChange(query) {
        this.query = query;
    }

    onCreateBtnClick() {
        this.createAnalysis(this.query);
    }

    onToggleAnalysisBtnClick() {
        if (this.currentAnalysis) {
            if (this.currentAnalysis.status === AnalysisStatus.Ready || this.currentAnalysis.status === AnalysisStatus.Stopped) {
                this.startAnalysis(this.currentAnalysis);
            } else if (this.currentAnalysis.status === AnalysisStatus.Running) {
                this.stopAnalysis(this.currentAnalysis);
            }
        }
    }

    onCompleteBtnClick() {
        if (this.currentAnalysis && this.currentAnalysis.status === AnalysisStatus.Running) {
            this.completeAnalysis(this.currentAnalysis);
        }
    }

    onCurrentAnalysisChange(analysis: IAnalysis) {
        if (this.isSupportedAnalysis(analysis)) {
            if (this.mode === 'view') {
                this.query = this.currentAnalysis.query;
            }

            if (this.waitingNewAnalysis) {
                this.router
                    .navigate(['/analysis/twitter-neel/query/view/' + analysis.id])
                    .catch(e => console.error(e));

                this.waitingNewAnalysis = false;
            }
        }
    }

    isSupportedAnalysis(analysis: IAnalysis) {
        return (analysis && analysis.id && analysis.type === 'twitter-neel' && analysis.inputType === 'query');
    }

    createAnalysis(query: string) {
        const analysis: IAnalysis = {
            type: AnalysisType.TwitterNeel,
            inputType: AnalysisInputType.Query,
            query,
        };

        this.waitingNewAnalysis = true;
        this.analysisStore.dispatch(new CreateAnalysis(analysis));
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

    startListenAnalysisChanges(analysis: IAnalysis) {
        this.analysisStore.dispatch(new StartListenAnalysisChanges(analysis.id));
    }

    stopListenAnalysisChanges(analysis?: IAnalysis) {
        const analysisId = analysis ? analysis.id : null;
        this.analysisStore.dispatch(new StopListenAnalysisChanges(analysisId));
    }
}
