import { AnalysisViewComponent } from 'app/analysis/components/analysis-view.component';
import { AnalysisType, GetAnalysisResults, IAnalysis } from 'app/analysis';
import { IPaginationInfo, selectPagination, StartListenTwitterNeelResults, StopListenTwitterNeelResults, TwitterNeelState } from 'app/analysis/twitter-neel';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

export abstract class TwitterNeelAnalysisViewComponent extends AnalysisViewComponent {
    protected tNeelStore: Store<TwitterNeelState>;

    get analysisType(): AnalysisType {
        return AnalysisType.TwitterNeel;
    }

    get paginationInfo(): IPaginationInfo {
        let pagination = null;
        this.tNeelStore
            .select(selectPagination)
            .pipe(take(1))
            .subscribe(p => pagination = p);

        return pagination;
    }

    startListenResults(analysis: IAnalysis) {
        this.analysisStore.dispatch(new StartListenTwitterNeelResults(analysis.id));
    }

    stopListenResults(analysis?: IAnalysis) {
        const analysisId = analysis ? analysis.id : null;
        this.analysisStore.dispatch(new StopListenTwitterNeelResults(analysisId));
    }

    fetchResultsPage(page: number) {
        const pageSize = this.paginationInfo.pageSize;
        const action = new GetAnalysisResults(this.currentAnalysis.id, page, pageSize);

        this.analysisStore.dispatch(action);
    }
}
