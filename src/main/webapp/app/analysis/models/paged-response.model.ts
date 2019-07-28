export interface IPagedResponse {
    totalCount: number;
    pageSize: number;
    page: number;
    count: number;
    objects: any[];
}
