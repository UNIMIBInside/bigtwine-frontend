import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import {
    AnalysisState,
    AnalysisStatus, ExportAnalysisResults,
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

    get resultsPagination(): IPaginationInfo {
        let pagination = null;
        this.analysisStore
            .select(selectResultsPagination)
            .pipe(take(1))
            .subscribe(p => pagination = p);

        return pagination;
    }

    get searchPagination(): IPaginationInfo {
        let pagination = null;
        this.analysisStore
            .select(selectSearchPagination)
            .pipe(take(1))
            .subscribe(p => pagination = p);

        return pagination;
    }

    get pagination(): IPaginationInfo {
        if (this.searchPagination.enabled) {
            return this.searchPagination;
        } else if (this.resultsPagination.enabled) {
            return this.resultsPagination;
        } else {
            return null;
        }
    }

    get paginationEnabled(): boolean {
        return this.pagination !== null;
    }

    get canExport(): boolean {
        return true;
    }

    get shouldShowExportBtn(): boolean {
        const acceptedStatuses = new Set<string>([
            AnalysisStatus.Failed,
            AnalysisStatus.Completed,
            AnalysisStatus.Cancelled,
        ]);
        return this.currentAnalysis && acceptedStatuses.has(this.currentAnalysis.status);
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

    onChangePageBtnClick(move: number) {
        if (!this.paginationEnabled) {
            return;
        }

        const page = this.pagination.currentPage + move;
        if (page < 0 || page >= this.pagination.pagesCount) {
            return;
        }

        if (this.searchPagination.enabled) {
            this.performFullSearch(page);
        } else if (this.resultsPagination.enabled) {
            this.fetchPage(page);
        }
    }

    onExportBtnClick() {
        const action: Action = new ExportAnalysisResults(this.currentAnalysis.id);
        this.analysisStore.dispatch(action);
    }

    performLiveSearch() {
        if (this.shouldSearch) {
            const query = this.buildQuery();
            const page = {
                page: 0,
                pageSize: this.searchPagination.pageSize
            };

            this.resultsFilterService.localSearch(query, page);
        } else {
            this.resultsFilterService.clear();
        }
    }

    performFullSearch(pageNum = 0) {
        if (this.shouldSearch) {
            const analysisId = this.currentAnalysis.id;
            const query = this.buildQuery();
            const page = {
                page: pageNum,
                pageSize: this.searchPagination.pageSize
            };

            const action: Action = new SearchAnalysisResults(analysisId, query, page);
            this.analysisStore.dispatch(action);
        }
    }

    private buildQuery(): IResultsFilterQuery {
        if (!this.searchQuery) {
            return null;
        }

        return {
            text: this.searchQuery
        };
    }

    private fetchFirstPage() {
        this.fetchPage(0);
    }

    private fetchPrevPage() {
        this.fetchPage(this.resultsPagination.currentPage - 1);
    }

    private fetchNextPage() {
        this.fetchPage(this.resultsPagination.currentPage + 1);
    }

    private fetchPage(page: number) {
        const pageSize = this.resultsPagination.pageSize;
        const action = new GetAnalysisResults(this.currentAnalysis.id, {page, pageSize});

        this.analysisStore.dispatch(action);
    }
}
