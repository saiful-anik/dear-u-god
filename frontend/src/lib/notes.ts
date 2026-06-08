export interface Note {
  id: string;
  to: string;
  from: string;
  message: string;
  createdAt: string;
}

interface NoteApiResponse {
  id: string;
  to: string;
  from: string;
  message: string;
  created_at: string;
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!apiBaseUrl) {
  throw new Error("Missing API configuration. Set VITE_API_BASE_URL.");
}

function normalizeApiBaseUrl(rawValue: string): string {
  const trimmedValue = rawValue.trim().replace(/\/+$/, "");

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  if (trimmedValue.startsWith("//")) {
    return `${window.location.protocol}${trimmedValue}`;
  }

  if (trimmedValue.startsWith("/")) {
    return `${window.location.origin}${trimmedValue}`;
  }

  const isLocalAddress =
    /^(localhost|127(?:\.\d{1,3}){3}|0\.0\.0\.0|\[::1\])(?::\d+)?(?:\/.*)?$/i.test(trimmedValue);

  return `${isLocalAddress ? "http" : "https"}://${trimmedValue}`;
}

const normalizedApiBaseUrl = normalizeApiBaseUrl(apiBaseUrl);

function getApiUrl(path: string): string {
  return `${normalizedApiBaseUrl}${path}`;
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  let payload: ApiSuccess<T> | ApiFailure | null = null;

  try {
    payload = (await response.json()) as ApiSuccess<T> | ApiFailure;
  } catch {
    throw new Error("The API returned an invalid JSON response.");
  }

  if (!payload || typeof payload !== "object" || !("success" in payload)) {
    throw new Error("The API returned an unexpected response.");
  }

  if (!response.ok || !payload.success) {
    throw new Error(payload.success ? "Request failed." : payload.error.message);
  }

  return payload.data;
}

function mapApiNoteToNote(note: NoteApiResponse): Note {
  return {
    id: note.id,
    to: note.to,
    from: note.from,
    message: note.message,
    createdAt: note.created_at,
  };
}

export async function saveNote(note: Omit<Note, "id" | "createdAt">): Promise<string> {
  const response = await fetch(getApiUrl("/api/message"), {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      to: note.to,
      from: note.from,
      message: note.message,
    }),
  });

  const data = await parseApiResponse<{ id: string }>(response);
  return data.id;
}

export async function getNote(id: string): Promise<Note | null> {
  const response = await fetch(getApiUrl(`/api/message/${encodeURIComponent(id)}`));

  if (response.status === 404) {
    return null;
  }

  const data = await parseApiResponse<NoteApiResponse>(response);
  return mapApiNoteToNote(data);
}

export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(getApiUrl("/health"));
  return parseApiResponse<{ status: string }>(response);
}

export async function checkDatabaseHealth(): Promise<{ status: string }> {
  const response = await fetch(getApiUrl("/health/db"));
  return parseApiResponse<{ status: string }>(response);
}

export function getShareUrl(id: string): string {
  return `${window.location.origin}/note/${id}`;
}
