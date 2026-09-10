import {Container, Service} from 'typedi';
import {DB} from "@domain/di-tokens/Tokens";
import {sql} from "drizzle-orm";

@Service()
export class UserProvider {
    private get db() {
        return Container.get(DB);
    }

    async findUserRecord(staffNumber: string) {
        return this.db.execute(
            sql.raw(`SELECT * FROM users WHERE staffNumber = '${staffNumber}'`)
        );
    }
}