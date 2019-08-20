import { AnalysisViewComponent } from './analysis-view.component';
import { AnalysisStatus, IAnalysis } from 'app/analysis';

export abstract class BoundedAnalysisViewComponent extends AnalysisViewComponent {
    get showCreateBtn(): boolean {
        return false;
    }

    get showStartBtn(): boolean {
        return this._checkAnalysisStatus(AnalysisStatus.Ready);
    }

    get showStopBtn(): boolean {
        return false;
    }

    get showCancelBtn(): boolean {
        return this._checkAnalysisStatus(AnalysisStatus.Started);
    }

    get showCompleteBtn(): boolean {
        return false;
    }

    onCurrentAnalysisChange(analysis: IAnalysis) {
        super.onCurrentAnalysisChange(analysis);
    }
}
