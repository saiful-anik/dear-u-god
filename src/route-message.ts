import { neon } from "@neondatabase/serverless";

type Sql = ReturnType<typeof neon>;
type JsonResponse = (data: unknown, init?: ResponseInit) => Response;

const fallbackSenders = [
  "Someone Smiling",
  "Someone Thinking of You",
  "A Quiet Heart",
  "Someone Special",
  "The One Who Cares",
  "A Dreamer",
];

const fallbackReceivers = ["Someone Special"];

const randomItem = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

export const getRandomSender = () => randomItem(fallbackSenders);
export const getRandomReceiver = () => randomItem(fallbackReceivers);

export async function routeMessage(
  request: Request,
  url: URL,
  sql: Sql,
  json: JsonResponse,
): Promise<Response | null> {
  const messageRoute = url.pathname.match(/^\/api\/message\/([^/]+)$/);

  // Handle GET /api/message/:id
  if (request.method === "GET" && messageRoute) {
    const id = messageRoute[1];

    try {
      const rows = await sql`
				SELECT
					id,
					"from",
					"to",
					message,
					created_at
				FROM messages
				WHERE id = ${id}
				LIMIT 1
			`;

      if (!Array.isArray(rows)) {
        return json(
          {
            success: false,
            error: {
              code: "DATABASE_ERROR",
              message: "Unexpected query result format",
            },
          },
          { status: 500 },
        );
      }

      if (rows.length === 0) {
        return json(
          {
            success: false,
            error: {
              code: "NOT_FOUND",
              message: "Message not found",
            },
          },
          { status: 404 },
        );
      }

      return json({
        success: true,
        data: rows[0],
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch message";

      return json(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message,
          },
        },
        { status: 500 },
      );
    }
  }

  // Handle POST /api/message
  if (request.method === "POST" && url.pathname === "/api/message") {
    try {
      const body = (await request.json()) as {
        from?: string;
        to?: string;
        message?: string;
      };

      if (!body.message?.trim()) {
        return json(
          {
            success: false,
            error: {
              code: "MESSAGE_REQUIRED",
              message: "message is required",
            },
          },
          { status: 400 },
        );
      }

      const rows = await sql`
				INSERT INTO messages (
					"from",
					"to",
					message
				)
				VALUES (
					${body.from?.trim() || getRandomSender()},
					${body.to?.trim() || getRandomReceiver()},
					${body.message.trim()}
				)
				RETURNING id
			`;

      if (
        !Array.isArray(rows) ||
        rows.length === 0 ||
        typeof rows[0] !== "object" ||
        rows[0] === null ||
        !("id" in rows[0]) ||
        typeof (rows[0] as { id?: unknown }).id !== "string"
      ) {
        return json(
          {
            success: false,
            error: {
              code: "DATABASE_ERROR",
              message: "Unexpected query result format",
            },
          },
          { status: 500 },
        );
      }

      return json(
        {
          success: true,
          data: {
            id: (rows[0] as { id: string }).id,
          },
        },
        { status: 201 },
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create message";

      return json(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message,
          },
        },
        { status: 500 },
      );
    }
  }

  return null;
}
