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
import { IResultsFilterService, RESULTS_FILTER_SERVICE } from 'app/analysis/services/results-filter.service';
import { IResultsFilterQuery } from 'app/analysis/models/results-filter-query.model';

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
            const query = this.buildQuery();
            const page = {
                page: 1,
                pageSize: this.searchPaginationInfo.pageSize
            };

            this.resultsFilterService.localSearch(query, page);
        } else {
            this.resultsFilterService.clear();
        }
    }

    performFullSearch() {
        const analysisId = this.currentAnalysis.id;
        let action: Action;

        if (this.shouldSearch) {
            const query = this.buildQuery();
            const page = {
                page: 1,
                pageSize: this.searchPaginationInfo.pageSize
            };

            action = new SearchAnalysisResults(analysisId, query, page);
        } else {
            const page = {
                page: 1,
                pageSize: this.paginationInfo.pageSize
            };

            action = new GetAnalysisResults(analysisId, page);
        }

        this.analysisStore.dispatch(action);
    }

    private buildQuery(): IResultsFilterQuery {
        if (!this.searchQuery) {
            return null;
        }

        return {
            text: this.searchQuery
        };
    }
}
