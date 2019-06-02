import {
    initialState,
    AnalysisReducer,
    GetAnalysis,
    CreateAnalysis,
    GetAnalyses,
    StopAnalysis,
    StartAnalysis,
    StartListenAnalysisChanges,
    StopListenAnalysisChanges
} from 'app/analysis/store';

describe('AnalysisReducer', () => {
    it('should return initial state on send actions', () => {
        const sendActions = [
            new GetAnalysis('analysis1'),
            new CreateAnalysis(null),
            new GetAnalyses(),
            new StopAnalysis('analysis1'),
            new StartAnalysis('analysis1'),
            new StartListenAnalysisChanges('analysis1'),
            new StopListenAnalysisChanges('analysis1'),
        ];

        for (const action of sendActions) {
            const state = AnalysisReducer(undefined, action);

            expect(state).toBe(initialState);
        }
    });
});
