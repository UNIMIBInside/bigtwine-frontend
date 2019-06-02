import { IAnalysis } from 'app/analysis';
import { createSelector } from '@ngrx/store';

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

export const selectCurrentAnalysis = createSelector(
    (state: AnalysisState) => state,
    (state: AnalysisState) => state.currentAnalysis,
);

export const selectAllAnalyses = createSelector(
    (state: AnalysisState) => state,
    (state: AnalysisState) => state.analyses,
);

export const selectAnalysesByType = createSelector(
    (state: AnalysisState) => state.analyses,
    (analyses: IAnalysis[], analysisType: string) => analyses.filter(a => a.type === analysisType),
);

export const selectLastError = createSelector(
    (state: AnalysisState) => state,
    (state: AnalysisState) => state.lastError,
);
