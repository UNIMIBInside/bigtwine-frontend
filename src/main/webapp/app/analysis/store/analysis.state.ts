import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAnalysis, IPaginationInfo, IDocument } from 'app/analysis/models';

export interface AnalysisState {
    analyses: {
        all: IAnalysis[],
        byId: {[key: string]: IAnalysis},
    };
    currentAnalysis: IAnalysis;
    changesListeningAnalysisId: string;
    resultsListeningAnalysisId: string;
    resultsPagination: IPaginationInfo;
    resultsFilters: {
        query: any;
        pagination: IPaginationInfo;
    };
    documents: {
        byId: {[key: string]: IDocument}
    };
    lastError: {type: string, error: Error};
    errorHistory: {type: string, error: Error}[];
}

export const initAnalysisState = (): AnalysisState => {
    return ({
        analyses: {
            all: [],
            byId: {},
        },
        currentAnalysis: null,
        changesListeningAnalysisId: null,
        resultsListeningAnalysisId: null,
        resultsPagination: {
            enabled: false,
            currentPage: null,
            pagesCount: null,
            allItemsCount: null,
            pageSize: 100,
        },
        resultsFilters: {
            query: null,
            pagination: {
                enabled: false,
                currentPage: null,
                pagesCount: null,
                allItemsCount: null,
                pageSize: 100,
            }
        },
        documents: {
            byId: {}
        },
        lastError: null,
        errorHistory: [],
    });
};

export const selectAnalysisFeature = createFeatureSelector<AnalysisState>('analysis');

export const selectCurrentAnalysis = createSelector(
    selectAnalysisFeature,
    (state: AnalysisState) => state.currentAnalysis,
);

export const selectAllAnalyses = createSelector(
    selectAnalysisFeature,
    (state: AnalysisState) => state.analyses.all,
);

export const selectAnalysesByType = (analysisType: string) => createSelector(
    selectAnalysisFeature,
    (state: AnalysisState) => state.analyses.all.filter(a => a.type === analysisType),
);

export const selectLastError = createSelector(
    selectAnalysisFeature,
    (state: AnalysisState) => state.lastError,
);

export const selectResultsPagination = createSelector(
    selectAnalysisFeature,
    (state: AnalysisState) => state.resultsPagination,
);

export const selectSearchPagination = createSelector(
    selectAnalysisFeature,
    (state: AnalysisState) => state.resultsFilters.pagination,
);

export const selectSearchQuery = createSelector(
    selectAnalysisFeature,
    (state: AnalysisState) => state.resultsFilters.query,
);

export const selectResultsListeningAnalysisId = createSelector(
    selectAnalysisFeature,
    (state: AnalysisState) => state.resultsListeningAnalysisId,
);

export const selectChangesListeningAnalysisId = createSelector(
    selectAnalysisFeature,
    (state: AnalysisState) => state.changesListeningAnalysisId,
);

export const selectDocumentById = (documentId: string) => createSelector(
    selectAnalysisFeature,
    (state: AnalysisState) => state.documents.byId[documentId]
);
