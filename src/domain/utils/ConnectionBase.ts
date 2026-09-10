import {drizzle} from 'drizzle-orm/mysql2';
import {type Connection, createConnection, createPool, Pool} from 'mysql2/promise';
import {Container} from 'typedi';
import {DB} from "@domain/di-tokens/Tokens";

export interface DBSecret {
    username: string;
    password: string;
    engine: string;
    host: string;
    port: number;
    dbname: string;
    dbClusterIdentifier?: string;
}

export abstract class ConnectionBase {
    private static pool: Pool | null;
    private static readonly port = 3306;

    async configure() {
        await this.initPool();
    }

    private async initPool() {
        console.debug('Initialising database connection pool');

        if (ConnectionBase.pool) {
            try {
                // Pool exists, then reuse it
                Container.set(DB, drizzle(ConnectionBase.pool));
                console.debug('Reusing existing pool');
                return;
            } catch {
               console.warn('Existing pool unhealthy, creating new one');
                await ConnectionBase.pool.end().catch(() => {});
                ConnectionBase.pool = null;
            }
        }

        const secret = await ConnectionBase.getSecret();

        // create a new pool
        ConnectionBase.pool = createPool({
            host: secret.host,
            user: secret.username,
            password: secret.password,
            port: ConnectionBase.port,
            multipleStatements: true,
            connectionLimit: 10,
        });

        Container.set(DB, drizzle(ConnectionBase.pool));

        console.info('Database connection pool initialised');
    }

    static async getSecret(): Promise<DBSecret> {
        return {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            engine: 'mysql',
            host: process.env.CLUSTER,
            port: Number(process.env.DB_PORT) || ConnectionBase.port,
            dbname: process.env.SCHEMA,
        } as DBSecret
    }
}