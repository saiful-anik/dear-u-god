import { supabase } from "@/lib/supabase";

export interface Note {
  id: string;
  to: string;
  from: string;
  message: string;
  createdAt: string;
}

interface NoteRow {
  id: string;
  recipient: string;
  sender: string;
  message: string;
  created_at: string;
}

function mapRowToNote(row: NoteRow): Note {
  return {
    id: row.id,
    to: row.recipient,
    from: row.sender,
    message: row.message,
    createdAt: row.created_at,
  };
}

export async function saveNote(note: Omit<Note, "id" | "createdAt">): Promise<string> {
  const { data, error } = await supabase
    .from("notes")
    .insert({
      recipient: note.to,
      sender: note.from,
      message: note.message,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to save note.");
  }

  return data.id;
}

export async function getNote(id: string): Promise<Note | null> {
  const { data, error } = await supabase
    .from("notes")
    .select("id, recipient, sender, message, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapRowToNote(data as NoteRow);
}

export async function checkNotesConnection(): Promise<void> {
  const { error } = await supabase
    .from("notes")
    .select("id")
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }
}

export function getShareUrl(id: string): string {
  return `${window.location.origin}/note/${id}`;
}
