import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { debounceTime, filter, take, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { IResultsFilterQuery, ResultsFilterService } from 'app/analysis/twitter-neel/services/results-filter.service';
import { AnalysisState, AnalysisStatus, GetAnalysisResults, IAnalysis, SearchAnalysisResults, selectCurrentAnalysis } from 'app/analysis';
import { select, Store, Action } from '@ngrx/store';
import { FormControl } from '@angular/forms';
import { IPaginationInfo, selectPagination, selectSearchPagination, TwitterNeelState } from 'app/analysis/twitter-neel';

@Component({
    selector: 'btw-results-toolbar',
    templateUrl: './results-toolbar.component.html',
    styleUrls: ['./results-toolbar.component.scss']
})
export class ResultsToolbarComponent implements OnInit, OnDestroy {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private currentAnalysis$: Observable<IAnalysis>;
    private currentViewMode: string;

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
        this.tNeelStore
            .select(selectPagination)
            .pipe(take(1))
            .subscribe(p => pagination = p);

        return pagination;
    }

    get searchPaginationInfo(): IPaginationInfo {
        let pagination = null;
        this.tNeelStore
            .select(selectSearchPagination)
            .pipe(take(1))
            .subscribe(p => pagination = p);

        return pagination;
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private analysisStore: Store<AnalysisState>,
        private tNeelStore: Store<TwitterNeelState>,
        private resultsFilterService: ResultsFilterService) {}

    ngOnInit(): void {
        this.currentAnalysis$ = this.analysisStore.pipe(select(selectCurrentAnalysis));
        this.router.events.pipe(
            filter(e => e instanceof RouterEvent),
            takeUntil(this.destroyed$),
        ).subscribe((e: RouterEvent) => {
            this.onRouteChange(e);
        });

        this.onRouteChange(null);

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

    onToggleViewModeBtnClick() {
        const currentMode = this.currentViewMode;
        const isMapView = currentMode === 'map';

        this.switchViewMode(isMapView ? 'list' : 'map');
    }

    onRouteChange(event: RouterEvent) {
        this.currentViewMode = this.getCurrentViewMode();
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
