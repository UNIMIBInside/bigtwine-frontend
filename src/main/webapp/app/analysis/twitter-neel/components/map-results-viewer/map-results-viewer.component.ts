import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ResultsViewerComponent } from 'app/analysis/twitter-neel/components/results-viewer.component';
import { ILocation, LocationSource } from 'app/analysis/twitter-neel/models/location.model';
import { select, Store } from '@ngrx/store';
import {
    buildNilEntityIdentifier,
    selectAllResources,
    selectAllTweets, selectLocationsBySource,
    selectNilEntities, selectNilEntitiesTweetsCount,
    selectResourcesTweetsCount,
    TwitterNeelState
} from 'app/analysis/twitter-neel';
import { Observable } from 'rxjs';
import { IAnalysis } from 'app/analysis';
import { AnalysisState, selectCurrentAnalysis } from 'app/analysis/store';
import { ILinkedEntity, INeelProcessedTweet, INilEntity, IResource } from 'app/analysis/twitter-neel/models/neel-processed-tweet.model';
import { map, throttleTime } from 'rxjs/operators';

@Component({
    templateUrl: './map-results-viewer.component.html',
    styleUrls: ['./map-results-viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapResultsViewerComponent extends ResultsViewerComponent implements OnInit {

    currentAnalysis$: Observable<IAnalysis>;
    tweets$: Observable<INeelProcessedTweet[]>;
    // statuses$: Observable<ITwitterStatus[]>;
    nilEntities$: Observable<INilEntity[]>;
    linkedEntities$: Observable<ILinkedEntity[]>;
    resources$: Observable<IResource[]>;
    // locations$: Observable<ILocation[]>;
    statusLocations$: Observable<ILocation[]>;
    userLocations$: Observable<ILocation[]>;
    resourceLocations$: Observable<ILocation[]>;

    resourcesCounter: {[key: string]: number} = {};
    nilEntitiesCounter: {[key: string]: number} = {};

    selectedTweet: INeelProcessedTweet = null;
    selectedResource: IResource = null;
    selectedNilEntity: INilEntity = null;

    filteredTweets$: Observable<INeelProcessedTweet[]>;
    paginatedTweets$: Observable<INeelProcessedTweet[]>;

    currentPage = 1;
    pageSize = 250;

    constructor(private changeDetector: ChangeDetectorRef,
                private analysisStore:  Store<AnalysisState>,
                private tNeelStore: Store<TwitterNeelState>) {
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

        this.tNeelStore.pipe(select(selectResourcesTweetsCount)).subscribe(counters => {
            this.resourcesCounter = counters;
        });

        this.tNeelStore.pipe(select(selectNilEntitiesTweetsCount)).subscribe(counters => {
            this.nilEntitiesCounter = counters;
        });

        this.statusLocations$ = this.tNeelStore.pipe(select(selectLocationsBySource(LocationSource.Status)));
        this.resourceLocations$ = this.tNeelStore.pipe(select(selectLocationsBySource(LocationSource.Resource)));
        this.userLocations$ = this.tNeelStore.pipe(select(selectLocationsBySource(LocationSource.TwitterUser)));
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

}
