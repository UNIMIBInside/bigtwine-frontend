export enum AnalysisStatus {
    Ready = 'ready',
    Stopped = 'stopped',
    Started = 'started',
    Completed = 'completed',
    Cancelled = 'cancelled',
    Failed = 'failed',
}

export enum AnalysisInputType {
    Query = 'query',
    Dataset = 'dataset',
}

export enum AnalysisType {
    TwitterNeel = 'twitter-neel',
}

export interface IAnalysisInput {
    type: AnalysisInputType;
}

export interface IQueryAnalysisInput extends IAnalysisInput {
    tokens: string[];
    joinOperator: string;
}

export interface IDatasetAnalysisInput extends IAnalysisInput {
    documentId: string;
}

export interface IAnalysis {
    id?: string;
    type?: string;
    owner?: string;
    status?: string;
    input?: IAnalysisInput;
    progress?: number;
}

export class Analysis implements IAnalysis {
    id: string;
    input: IAnalysisInput;
    owner: string;
    status: string;
    type: string;
}
