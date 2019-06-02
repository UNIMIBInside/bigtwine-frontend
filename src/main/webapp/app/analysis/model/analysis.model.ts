export interface IAnalysis {
    id?: string;
    type?: string;
    inputType?: string;
    owner?: string;
    status?: string;
}

export class Analysis implements IAnalysis {
    id: string;
    inputType: string;
    owner: string;
    status: string;
    type: string;
}
