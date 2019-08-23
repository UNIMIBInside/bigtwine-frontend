import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AnalysisState, GetAnalyses, IAnalysis, selectAnalysesByType } from 'app/analysis';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'btw-analysis-list',
    templateUrl: './analysis-list.component.html',
    styleUrls: ['./analysis-list.component.scss']
})
export class AnalysisListComponent implements OnInit, OnDestroy {
    private destroyed$ = new ReplaySubject<boolean>(1);
    analyses$: Observable<IAnalysis[]>;

    @Input() analysisType: string;

    constructor(private analysisStore: Store<AnalysisState>) {}

    ngOnInit(): void {
        this.analyses$ = this.analysisStore
            .select(selectAnalysesByType(this.analysisType))
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
