import { Component, Inject, Input, OnInit } from '@angular/core';
import { AnalysisState, ExportAnalysisResults, IAnalysis, IAnalysisResultsExportFormat } from 'app/analysis';
import { Action, Store } from '@ngrx/store';
import { AnalysisService } from 'app/analysis/services/analysis.service';
import { IResultsExportService, RESULTS_EXPORT_SERVICE } from 'app/analysis/services/results-export.service';

@Component({
    selector: 'btw-results-export-btn',
    templateUrl: './results-export-btn.component.html',
    styleUrls: ['./results-export-btn.component.scss']
})
export class ResultsExportBtnComponent implements OnInit {

    @Input() analysis: IAnalysis;

    get exportLink(): string {
        return this.analysisService
            .getDocumentDownloadLink(this.analysis.export.documentId);
    }

    constructor(
        private analysisStore: Store<AnalysisState>,
        private analysisService: AnalysisService,
        @Inject(RESULTS_EXPORT_SERVICE) private exportService: IResultsExportService
    ) { }

    ngOnInit() {
    }

    onExportBtnClick(formatType: string) {
        const action: Action = new ExportAnalysisResults(this.analysis.id, formatType);
        this.analysisStore.dispatch(action);
    }

    getExportFormats(): IAnalysisResultsExportFormat[] {
        return this.exportService.getSupportedExportFormats(this.analysis);
    }
}
