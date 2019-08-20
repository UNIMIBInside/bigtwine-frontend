import { AnalysisViewComponent } from './analysis-view.component';
import { AnalysisStatus, IAnalysis } from 'app/analysis';

export abstract class StreamAnalysisViewComponent extends AnalysisViewComponent {

    get showCreateBtn(): boolean {
        return false;
    }

    get showStartBtn(): boolean {
        return this._checkAnalysisStatus(AnalysisStatus.Ready, AnalysisStatus.Stopped);
    }

    get showStopBtn(): boolean {
        return this._checkAnalysisStatus(AnalysisStatus.Started);
    }

    get showCancelBtn(): boolean {
        return false;
    }

    get showCompleteBtn(): boolean {
        return this._checkAnalysisStatus(AnalysisStatus.Started);
    }

    onCurrentAnalysisChange(analysis: IAnalysis) {
        super.onCurrentAnalysisChange(analysis);
    }
}
