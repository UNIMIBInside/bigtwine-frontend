import { InjectionToken } from '@angular/core';
import { IAnalysisResultsExportFormat } from 'app/analysis/models/analysis-results-export-format.model';
import { IAnalysis } from 'app/analysis';

export interface IResultsExportService {

    getSupportedExportFormats(analysis: IAnalysis): IAnalysisResultsExportFormat[];
}

export const RESULTS_EXPORT_SERVICE = new InjectionToken<IResultsExportService>('results-export.service');
