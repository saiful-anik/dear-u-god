import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { routeMessage } from "./route-message";

type Env = {
  DATABASE_URL: string;
};

const registeredEndpoints = [
  "GET /",
  "GET /health",
  "GET /health/db",
  "GET /api/message/:id",
  "POST /api/message",
];

console.log("[BOOT] Registered endpoints");

for (const endpoint of registeredEndpoints) {
  console.log(`[ENDPOINT] ${endpoint}`);
}

const json = (data: unknown, init?: ResponseInit) =>
  Response.json(data, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "allow-origin": "*",
    },
    ...init,
  });

const getDatabaseStatus = async (databaseUrl: string) => {
  const sql = neon(databaseUrl);
  await sql`select 1 as ok`;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (!env.DATABASE_URL) {
      return json(
        {
          success: false,
          error: {
            code: "MISSING_DATABASE_URL",
            message: "DATABASE_URL is missing",
          },
        },
        { status: 500 },
      );
    }

    const sql: NeonQueryFunction<boolean, boolean> = neon(env.DATABASE_URL);

    if (request.method === "GET" && url.pathname === "/") {
      return json({
        success: true,
        data: {
          name: "love-notes-api",
          endpoints: registeredEndpoints,
        },
      });
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        success: true,
        data: {
          status: "ok",
        },
      });
    }

    if (request.method === "GET" && url.pathname === "/health/db") {
      try {
        await getDatabaseStatus(env.DATABASE_URL);

        return json({
          success: true,
          data: {
            status: "ok",
          },
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Database check failed";

        return json(
          {
            success: false,
            error: {
              code: "DATABASE_UNAVAILABLE",
              message,
            },
          },
          { status: 500 },
        );
      }
    }

    const messageResponse = await routeMessage(request, url, sql, json);

    if (messageResponse) {
      return messageResponse;
    }

    return json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Route not found",
        },
      },
      { status: 404 },
    );
  },
};
