import { PG_CLIENT } from "../../http";

export class User {
    static async existsEmail(email: string): Promise<boolean> {
        const result = await PG_CLIENT.query(
            `SELECT 1 FROM "User" WHERE "email" = $1 LIMIT 1`, [email]
        );

        return (result.rowCount ?? 0) > 0;
    }

    static async existsAlias(alias: string): Promise<boolean> {
        const result = await PG_CLIENT.query(
            `SELECT 1 FROM "User" WHERE "alias" = $1 LIMIT 1`, [alias]
        );

        return (result.rowCount ?? 0) > 0;
    }
}