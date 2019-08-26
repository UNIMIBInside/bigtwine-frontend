import { IUser } from 'app/analysis/models/user.model';

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

export interface IAnalysisStatusHistory {
    newStatus: AnalysisStatus;
    oldStatus: AnalysisStatus;
    user: IUser;
    errorCode: number;
    message: string;
    date: Date;
}

export interface IAnalysis {
    id?: string;
    type?: string;
    owner?: IUser;
    status?: string;
    statusHistory?: IAnalysisStatusHistory[];
    input?: IAnalysisInput;
    progress?: number;
    userSettings?: {[name: string]: any};
}

export class Analysis implements IAnalysis {
    id: string;
    input: IAnalysisInput;
    owner: IUser;
    status: string;
    type: string;
    userSettings: {[name: string]: any};
}
