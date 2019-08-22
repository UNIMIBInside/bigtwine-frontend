export interface IDocument {
    documentId: string;
    filename: string;
    size: number;
    contentType: string;
    uploadDate: Date;
    user: string;
}
