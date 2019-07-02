export enum AnalysisStatus {
    Ready = 'ready',
    Stopped = 'stopped',
    Running = 'running',
    Completed = 'completed',
}

export enum AnalysisInputType {
    Query = 'query',
    Document = 'document',
}

export enum AnalysisType {
    TwitterNeel = 'twitter-neel',
}

export interface IAnalysis {
    id?: string;
    type?: string;
    inputType?: string;
    owner?: string;
    status?: string;
    query?: string;
    documentId?: string;
}

export class Analysis implements IAnalysis {
    id: string;
    inputType: string;
    owner: string;
    status: string;
    type: string;
}
