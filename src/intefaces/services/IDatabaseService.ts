export interface IDatabaseService {
    connect(): Promise<void>;

    startTransaction(): Promise<any>;

    commitTransaction(session: any): Promise<void>;

    rollbackTransaction(session: any): Promise<void>;

    getSession?(): any;

    disconnect?(): Promise<void>;

    getConnection?(): any;
}
