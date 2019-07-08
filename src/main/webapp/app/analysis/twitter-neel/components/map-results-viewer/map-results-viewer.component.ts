import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take, takeUntil, throttleTime } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import {
    IAnalysis,
    AnalysisState,
    selectCurrentAnalysis, GetAnalysisResults
} from 'app/analysis';
import {
    buildNilEntityIdentifier,
    selectAllResources,
    selectAllTweets, selectLocationsBySource,
    selectNilEntities, selectNilEntitiesTweetsCount,
    selectResourcesTweetsCount,
    TwitterNeelState,
    ILinkedEntity, INeelProcessedTweet, INilEntity, IResource, ILocation, LocationSource, IPaginationInfo, selectPagination
} from 'app/analysis/twitter-neel';
import { ResultsViewerComponent } from 'app/analysis/twitter-neel/components/results-viewer.component';
import { IResultsFilterQuery, ResultsFilterService } from 'app/analysis/twitter-neel/services/results-filter.service';

@Component({
    templateUrl: './map-results-viewer.component.html',
    styleUrls: ['./map-results-viewer.component.scss'],
    selector: 'btw-map-results-viewer',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapResultsViewerComponent extends ResultsViewerComponent implements OnInit, OnDestroy {

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    currentAnalysis$: Observable<IAnalysis>;
    tweets$: Observable<INeelProcessedTweet[]>;
    nilEntities$: Observable<INilEntity[]>;
    linkedEntities$: Observable<ILinkedEntity[]>;
    resources$: Observable<IResource[]>;
    statusLocations$: Observable<ILocation[]>;
    userLocations$: Observable<ILocation[]>;
    resourceLocations$: Observable<ILocation[]>;

    resourcesCounter: {[key: string]: number} = {};
    nilEntitiesCounter: {[key: string]: number} = {};

    selectedTweet: INeelProcessedTweet = null;
    selectedResource: IResource = null;
    selectedNilEntity: INilEntity = null;
    filterQuery: IResultsFilterQuery = null;

    filteredTweets$: Observable<INeelProcessedTweet[]>;
    paginatedTweets$: Observable<INeelProcessedTweet[]>;

    currentPage = 1;
    pageSize = 250;

    get currentAnalysis(): IAnalysis {
        let currentAnalysis: IAnalysis = null;
        this.currentAnalysis$
            .pipe(take(1))
            .subscribe((analysis: IAnalysis) => currentAnalysis = analysis);

        return currentAnalysis;
    }

    get isFilteringEnabled() {
        return this.selectedNilEntity !== null || this.selectedResource !== null || this.filterQuery !== null;
    }

    get paginationInfo(): IPaginationInfo {
        let pagination = null;
        this.tNeelStore
            .select(selectPagination)
            .pipe(take(1))
            .subscribe(p => pagination = p);

        return pagination;
    }

    constructor(private changeDetector: ChangeDetectorRef,
                private analysisStore:  Store<AnalysisState>,
                private tNeelStore: Store<TwitterNeelState>,
                private resultsFilterService: ResultsFilterService) {
        super();
    }

    ngOnInit(): void {
        this.currentAnalysis$ = this.analysisStore.pipe(select(selectCurrentAnalysis));

        this.tweets$ = this.tNeelStore.pipe(select(selectAllTweets));
        this.nilEntities$ = this.tNeelStore.pipe(select(selectNilEntities));
        this.resources$ = this.tNeelStore.pipe(select(selectAllResources));
        this.paginatedTweets$ = this.tweets$.pipe(
            map(tweets => tweets.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize))
        );

        this.statusLocations$ = this.tNeelStore.pipe(select(selectLocationsBySource(LocationSource.Status)));
        this.resourceLocations$ = this.tNeelStore.pipe(select(selectLocationsBySource(LocationSource.Resource)));
        this.userLocations$ = this.tNeelStore.pipe(select(selectLocationsBySource(LocationSource.TwitterUser)));

        this.tNeelStore.pipe(
            select(selectResourcesTweetsCount),
            takeUntil(this.destroyed$),
        ).subscribe(counters => {
            this.resourcesCounter = counters;
        });

        this.tNeelStore.pipe(
            select(selectNilEntitiesTweetsCount),
            takeUntil(this.destroyed$),
        ).subscribe(counters => {
            this.nilEntitiesCounter = counters;
        });

        this.resultsFilterService.currentQuery$.subscribe(q => {
            this.onTweetsFilterQueryChange(q);
        });
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    stringifyTweetEntities(entities: ILinkedEntity[]) {
        return entities.map(e => e.value).join(', ');
    }

    nilEntityTweetsCount(entity: INilEntity) {
        return this.nilEntitiesCounter[buildNilEntityIdentifier(entity)];
    }

    onTweetClick(tweet: INeelProcessedTweet) {
        if (this.selectedTweet !== null && this.selectedTweet.id === tweet.id) {
            this.selectedTweet = null;
        } else {
            this.selectedTweet = tweet;
            this.selectedNilEntity = null;
            this.selectedResource = null;
        }
    }

    onResourceClick(resource: IResource) {
        if (this.selectedResource !== null && this.selectedResource.url === resource.url) {
            this.selectedResource = null;
        } else {
            this.selectedTweet = null;
            this.selectedNilEntity = null;
            this.selectedResource = resource;

            this.filteredTweets$ = this.tweets$
                .pipe(
                    throttleTime(5000),
                    map(allTweets => allTweets.filter(t => t.entities && t.entities
                        .some(e => e.resource && e.resource.url === resource.url))),
                    map(tweets => tweets.slice(0, this.pageSize)),
                );
        }
    }

    onNilEntityClick(entity: INilEntity) {
        if (this.selectedNilEntity !== null &&
            this.selectedNilEntity.value === entity.value &&
            this.selectedNilEntity.nilCluster === entity.nilCluster) {
            this.selectedNilEntity = null;
        } else {
            this.selectedTweet = null;
            this.selectedNilEntity = entity;
            this.selectedResource = null;

            this.filteredTweets$ = this.tweets$
                .pipe(
                    throttleTime(5000),
                    map(allTweets => allTweets.filter(t => t.entities && t.entities
                        .some(e => e.isNil && e.value === entity.value && e.nilCluster === entity.nilCluster))),
                    map(tweets => tweets.slice(0, this.pageSize)),
                );
        }
    }

    onTweetsFilterQueryChange(query: IResultsFilterQuery) {
        this.filterQuery = query;

        if (query) {
            this.selectedTweet = null;
            this.selectedNilEntity = null;
            this.selectedResource = null;

            this.filteredTweets$ = this.resultsFilterService.filteredTweets$;
        }
    }

    tweetCssClass(tweet: INeelProcessedTweet) {
        if (this.selectedTweet != null) {
            return (this.selectedTweet.id === tweet.id) ? 'status active' : 'status inactive';
        } else {
            return '';
        }
    }

    resourceCssClass(resource: IResource) {
        if (this.selectedResource != null) {
            return (this.selectedResource.url === resource.url) ? 'resource active' : 'resource inactive';
        } else {
            return '';
        }
    }

    nilEntityCssClass(entity: INilEntity) {
        if (this.selectedNilEntity != null) {
            return (this.selectedNilEntity.value === entity.value && this.selectedNilEntity.nilCluster === entity.nilCluster) ?
                'resource active' : 'resource inactive';
        } else {
            return '';
        }
    }

    selectedTweetLinkedEntities() {
        return this.selectedTweet.entities.filter(e => !e.isNil);
    }

    selectedTweetNilEntities() {
        return this.selectedTweet.entities.filter(e => e.isNil);
    }

    fetchPrevPage() {
        this.fetchPage(this.paginationInfo.currentPage - 1);
    }

    fetchNextPage() {
        this.fetchPage(this.paginationInfo.currentPage + 1);
    }

    fetchPage(page: number) {
        const pageSize = this.paginationInfo.pageSize;
        const action = new GetAnalysisResults(this.currentAnalysis.id, page, pageSize);

        this.analysisStore.dispatch(action);
    }
}
