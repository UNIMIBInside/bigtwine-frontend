import { IResultsExportService } from 'app/analysis/services/results-export.service';
import { IAnalysis, IAnalysisResultsExportFormat } from 'app/analysis';
import { Injectable } from '@angular/core';

@Injectable()
export class ResultsExportService implements  IResultsExportService {
    getSupportedExportFormats(analysis: IAnalysis): IAnalysisResultsExportFormat[] {
        return [
            {type: 'json', label: 'JSON'},
            {type: 'tsv', label: 'TSV'},
            {type: 'twitter-neel-challenge', label: 'NEEL Challenge'}
        ];
    }
}
