import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AnalysisState, GetAnalyses, IAnalysis, selectAnalysesByType } from 'app/analysis';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: './analysis-list.component.html',
    styleUrls: ['./analysis-list.component.scss'],
    selector: 'btw-analysis-list',
})
export class AnalysisListComponent implements OnInit, OnDestroy {

    private destroyed$ = new ReplaySubject<boolean>(1);
    analyses$: Observable<IAnalysis[]>;

    constructor(private analysisStore: Store<AnalysisState>) {}

    ngOnInit(): void {
        this.analyses$ = this.analysisStore
            .select(selectAnalysesByType('twitter-neel'))
            .pipe(takeUntil(this.destroyed$));

        this.refresh();
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    refresh() {
        this.analysisStore.dispatch(new GetAnalyses());
    }
}
