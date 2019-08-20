import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import {
    AnalysisState,
    AnalysisStatus,
    GetAnalysisResults,
    IAnalysis,
    IPaginationInfo,
    SearchAnalysisResults,
    selectCurrentAnalysis,
    selectResultsPagination,
    selectSearchPagination
} from 'app/analysis';
import { select, Store, Action } from '@ngrx/store';
import { FormControl } from '@angular/forms';
import { IResultsFilterService, IResultsFilterQuery, RESULTS_FILTER_SERVICE } from 'app/analysis/services/results-filter.service';

@Component({
    selector: 'btw-results-toolbar',
    templateUrl: './results-toolbar.component.html',
    styleUrls: ['./results-toolbar.component.scss']
})
export class ResultsToolbarComponent implements OnInit, OnDestroy {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private currentAnalysis$: Observable<IAnalysis>;

    searchQueryControl = new FormControl('');
    searchQuery: string;

    get currentAnalysis(): IAnalysis {
        let currentAnalysis: IAnalysis = null;
        this.currentAnalysis$
            .pipe(take(1))
            .subscribe((analysis: IAnalysis) => currentAnalysis = analysis);

        return currentAnalysis;
    }

    get liveSearchEnabled() {
        if (!this.currentAnalysis) {
            return true;
        }

        return this.currentAnalysis.status !== AnalysisStatus.Completed;
    }

    get shouldSearch() {
        return (this.searchQuery && this.searchQuery.trim().length >= 3);
    }

    get paginationInfo(): IPaginationInfo {
        let pagination = null;
        this.analysisStore
            .select(selectResultsPagination)
            .pipe(take(1))
            .subscribe(p => pagination = p);

        return pagination;
    }

    get searchPaginationInfo(): IPaginationInfo {
        let pagination = null;
        this.analysisStore
            .select(selectSearchPagination)
            .pipe(take(1))
            .subscribe(p => pagination = p);

        return pagination;
    }

    constructor(
        private analysisStore: Store<AnalysisState>,
        @Inject(RESULTS_FILTER_SERVICE) private resultsFilterService: IResultsFilterService) {}

    ngOnInit(): void {
        this.currentAnalysis$ = this.analysisStore.pipe(select(selectCurrentAnalysis));

        this.searchQueryControl.valueChanges
            .pipe(
                debounceTime(500),
                takeUntil(this.destroyed$),
            )
            .subscribe(() => this.onSearchQueryChange());
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    onSearchQueryChange() {
        if (!this.currentAnalysis) {
            return;
        }

        if (!this.liveSearchEnabled) {
            return;
        }

        this.performLiveSearch();
    }

    onSearchBtnCLick() {
        if (!this.currentAnalysis) {
            return;
        }

        this.performFullSearch();
    }

    performLiveSearch() {
        if (this.shouldSearch) {
            const query: IResultsFilterQuery = {
                text: this.searchQuery,
                page: 1,
                pageSize: this.searchPaginationInfo.pageSize,
            };

            this.resultsFilterService.localSearch(query);
        } else {
            this.resultsFilterService.clear();
        }
    }

    performFullSearch() {
        let action: Action;
        if (this.shouldSearch) {
            action = new SearchAnalysisResults(
                this.currentAnalysis.id,
                this.searchQuery,
                1,
                this.searchPaginationInfo.pageSize
            );
        } else {
            action = new GetAnalysisResults(
                this.currentAnalysis.id,
                1,
                this.paginationInfo.pageSize
            );
        }

        this.analysisStore.dispatch(action);
    }
}
