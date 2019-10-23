import { Component, Input, OnInit } from '@angular/core';
import { AnalysisState, ExportAnalysisResults, IAnalysis } from 'app/analysis';
import { Action, Store } from '@ngrx/store';
import { AnalysisService } from 'app/analysis/services/analysis.service';

interface AnalysisResultsExportFormat {
    type: string;
    label: string;
}

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
        private analysisService: AnalysisService
    ) { }

    ngOnInit() {
    }

    onExportBtnClick(formatType: string) {
        const action: Action = new ExportAnalysisResults(this.analysis.id);
        this.analysisStore.dispatch(action);
    }

    getExportFormats(): AnalysisResultsExportFormat[] {
        return [
            {type: 'json', label: 'JSON'},
            {type: 'tsv', label: 'TSV'},
            {type: 'neel-challenge-output', label: 'NEEL Challenge Output'},
        ];
    }
}
