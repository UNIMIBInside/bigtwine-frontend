import { IAnalysis } from 'app/analysis';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface AnalysisState {
    analyses: IAnalysis[];
    currentAnalysis: IAnalysis;
    changesListeningAnalysisId: string;
    resultsListeningAnalysisId: string;
    lastError: {type: string, error: Error};
    errorHistory: {type: string, error: Error}[];
}

export const initAnalysisState = (): AnalysisState => {
    return ({
        analyses: [],
        currentAnalysis: null,
        changesListeningAnalysisId: null,
        resultsListeningAnalysisId: null,
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
    (state: AnalysisState) => state.analyses,
);

export const selectAnalysesByType = createSelector(
    selectAnalysisFeature,
    (state: AnalysisState) => state.analyses,
    (state: AnalysisState, analyses: IAnalysis[], analysisType: string) => analyses.filter(a => a.type === analysisType),
);

export const selectLastError = createSelector(
    selectAnalysisFeature,
    (state: AnalysisState) => state.lastError,
);
