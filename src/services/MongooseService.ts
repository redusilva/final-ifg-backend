import mongoose, { ClientSession, Connection } from 'mongoose';

export class MongooseService {
    constructor(private readonly mongoUri: string) { }

    async connect(): Promise<void> {
        await mongoose.connect(this.mongoUri);
        console.log('🟢 Conectado ao MongoDB:', mongoose.connection.name);
    }

    async disconnect(): Promise<void> {
        await mongoose.disconnect();
        console.log('🔴 Desconectado do MongoDB');
    }

    async startTransaction(): Promise<ClientSession> {
        const session = await mongoose.startSession();
        session.startTransaction();
        return session;
    }

    async commitTransaction(session: ClientSession): Promise<void> {
        await session.commitTransaction();
        await session.endSession();
    }

    async rollbackTransaction(session: ClientSession): Promise<void> {
        await session.abortTransaction();
        await session.endSession();
    }

    getConnection(): Connection {
        return mongoose.connection;
    }
}
