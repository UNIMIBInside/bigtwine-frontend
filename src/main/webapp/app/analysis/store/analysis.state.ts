import { IAnalysis } from 'app/analysis';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface AnalysisState {
    analyses: IAnalysis[];
    currentAnalysis: IAnalysis;
    lastError: Error;
    errorHistory: Error[];
}

export const initAnalysisState = (): AnalysisState => {
    return ({
        analyses: [],
        currentAnalysis: null,
        lastError: null,
        errorHistory: [],
    });
};

export const selectAnalysisState = createFeatureSelector('analysis');

export const selectCurrentAnalysis = createSelector(
    selectAnalysisState,
    (state: AnalysisState) => state.currentAnalysis,
);

export const selectAllAnalyses = createSelector(
    selectAnalysisState,
    (state: AnalysisState) => state.analyses,
);

export const selectAnalysesByType = createSelector(
    selectAnalysisState,
    (analyses: IAnalysis[], analysisType: string) => analyses.filter(a => a.type === analysisType),
);

export const selectLastError = createSelector(
    selectAnalysisState,
    (state: AnalysisState) => state.lastError,
);
