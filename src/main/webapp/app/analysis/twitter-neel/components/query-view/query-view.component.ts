import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ActionTypes, AnalysisState, GetAnalysis, selectCurrentAnalysis, selectLastError } from 'app/analysis/store';
import { Observable } from 'rxjs';
import { IAnalysis, AnalysisStatus } from 'app/analysis';
import { first, take } from 'rxjs/operators';
import { StartListenTwitterNeelResults, StopListenTwitterNeelResults } from 'app/analysis/twitter-neel';

@Component({
  selector: 'btw-query-view',
  templateUrl: './query-view.component.html',
  styleUrls: ['./query-view.component.scss']
})
export class QueryViewComponent implements OnInit, OnDestroy {

    currentAnalysis$: Observable<IAnalysis>;
    lastError$: Observable<any>;

    get currentAnalysis(): IAnalysis {
        let currentAnalysis: IAnalysis = null;
        this.currentAnalysis$
            .pipe(take(1))
            .subscribe((analysis: IAnalysis) => currentAnalysis = analysis);

        return currentAnalysis;
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private analysisStore: Store<AnalysisState>
    ) { }

    ngOnInit() {
        this.currentAnalysis$ = this.analysisStore.select(selectCurrentAnalysis);
        this.lastError$ = this.analysisStore.pipe(select(selectLastError));

        this.currentAnalysis$.subscribe((analysis: IAnalysis) => {
            this.onCurrentAnalysisChange(analysis);
        });

        this.lastError$.pipe(first(e => e && e.type === ActionTypes.GetAnalysisError)).subscribe(e => {
            this.router
                .navigate(['/analysis/twitter-neel/query/new'])
                .catch(err => console.error(err));
        });

        this.route.paramMap.subscribe(params => {
            this.onRouteAnalysisIdChange(params.get('analysisId'));
        });

        this.onRouteAnalysisIdChange(this.route.snapshot.params.analysisId);
    }

    ngOnDestroy(): void {
        console.log('qui');
    }

    onRouteAnalysisIdChange(analysisId: string) {
        if (analysisId && (!this.currentAnalysis || this.currentAnalysis.id !== analysisId)) {
            this.analysisStore.dispatch(new GetAnalysis(analysisId));
        }
    }

    onCurrentAnalysisChange(analysis: IAnalysis) {
        if (analysis && analysis.status === AnalysisStatus.Running) {
            this.startListenResults(analysis);
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
}
