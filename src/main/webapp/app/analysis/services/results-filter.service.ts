import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface IResultsFilterQuery {
    text: string;
    page: number;
    pageSize: number;
}

export const DEFAULT_RESULTS_FILTER_THROTTLE = 5000;

export interface IResultsFilterService {

    readonly filteredResults$: Observable<any>;
    readonly currentQuery: IResultsFilterQuery;
    readonly currentQuery$: Observable<IResultsFilterQuery>;

    /**
     * Avvia una ricerca sui risultati disponibili localmente
     * @param query
     * @param throttleDuration
     */
    localSearch(query: IResultsFilterQuery, throttleDuration);

    localSearch(query: IResultsFilterQuery);

    clear();
}

export const RESULTS_FILTER_SERVICE = new InjectionToken<IResultsFilterService>('results-filter.service');
