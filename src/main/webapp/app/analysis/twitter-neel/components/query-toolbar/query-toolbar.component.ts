import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AnalysisState, CreateAnalysis, selectCurrentAnalysis, StartAnalysis, StartListenAnalysisChanges, StopAnalysis, StopListenAnalysisChanges } from 'app/analysis/store';
import { Observable, Subscription } from 'rxjs';
import { AnalysisInputType, AnalysisStatus, AnalysisType, IAnalysis } from 'app/analysis';
import { filter, take } from 'rxjs/operators';

@Component({
    selector: 'btw-query-toolbar',
    templateUrl: './query-toolbar.component.html',
    styleUrls: ['./query-toolbar.component.scss']
})
export class QueryToolbarComponent implements OnInit, OnDestroy {

    @Input() mode = 'new';
    private query: string;
    private currentViewMode: string;

    currentAnalysis$: Observable<IAnalysis>;
    subscriptions = new Subscription();

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
        return !this.showCreateButton;
    }

    get showResultsViewerButton() {
        return this.mode === 'view';
    }

    constructor(private router: Router, private route: ActivatedRoute, private analysisStore: Store<AnalysisState>) {
    }

    ngOnInit() {
        this.currentAnalysis$ = this.analysisStore.pipe(select(selectCurrentAnalysis));

        const s1 = this.currentAnalysis$.subscribe((analysis: IAnalysis) => {
            this.onCurrentAnalysisChange(analysis);
        });

        const s2 = this.router.events.pipe(filter(e => e instanceof RouterEvent)).subscribe((e: RouterEvent) => {
            this.onRouteChange(e);
        });

        this.onRouteChange(null);

        this.subscriptions.add(s1);
        this.subscriptions.add(s2);

        if (this.currentAnalysis && this.mode === 'view') {
            this.query = this.currentAnalysis.query;
        }
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
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

    onToggleViewModeBtnClick() {
        const currentMode = this.currentViewMode;
        const isMapView = currentMode === 'map';

        this.switchViewMode(isMapView ? 'list' : 'map');
    }

    onCurrentAnalysisChange(analysis: IAnalysis) {
        if (this.isSupportedAnalysis(analysis)) {
            this.router
                .navigate(['/analysis/twitter-neel/query/view/' + analysis.id])
                .catch(e => console.error(e));
        }
    }

    onRouteChange(event: RouterEvent) {
        this.currentViewMode = this.getCurrentViewMode();
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

        this.analysisStore.dispatch(new CreateAnalysis(analysis));
    }

    startAnalysis(analysis: IAnalysis) {
        this.analysisStore.dispatch(new StartAnalysis(analysis.id));
    }

    stopAnalysis(analysis: IAnalysis) {
        this.analysisStore.dispatch(new StopAnalysis(analysis.id));
    }

    startListenAnalysisChanges(analysis: IAnalysis) {
        this.analysisStore.dispatch(new StartListenAnalysisChanges(analysis.id));
    }

    stopListenAnalysisChanges(analysis?: IAnalysis) {
        const analysisId = analysis ? analysis.id : null;
        this.analysisStore.dispatch(new StopListenAnalysisChanges(analysisId));
    }

    getCurrentViewMode(): string {
        const path = this.route.snapshot.children
            .filter(r => r.outlet === 'results-viewer')
            .map(r => r.routeConfig.path)
            .shift();

        return path === '' ? 'map' : path;
    }

    switchViewMode(mode: string) {
        this.router
            .navigate([{'outlets': {'results-viewer': mode}}], {relativeTo: this.route})
            .catch(e => console.error(e));
    }
}
