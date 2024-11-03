import { PG_CLIENT } from "../http";
import { HTTPHandler } from "../http/core/http_handler";
import { AuthUtil } from "../utils/auth";

export const PROFILE_SELF_HTTP_HANDLER = new HTTPHandler({
    get: async (request, response) => {
        const userId = await AuthUtil.userIdOf(request);
        if (!userId) {
            response.writeHead(401);
            response.end();
            return;
        }

        const params = `"displayName", "email", "alias", "profileImage", "profileColor", "bookmarkedIcons", "downloadedIcons"`;
        const result = await PG_CLIENT.query(`SELECT ${params} FROM "User" JOIN "UserDetails" ON "User"."id" = "UserDetails"."id" WHERE "User"."id" = $1 LIMIT 1`, [
            userId
        ]);

        response.writeHead(200);
        response.end(JSON.stringify(result.rows[0]));
    }
});