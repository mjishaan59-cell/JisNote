import { notFound, redirect } from "next/navigation";
import { getNotes, getNote } from "@/app/actions/notes";
import { createClient } from "@/lib/supabase/server";
import Workspace from "@/components/Workspace";
import Editor from "@/components/Editor";
import NoteTitle from "@/components/NoteTitle";
import DeleteNoteButton from "@/components/DeleteNoteButton";

type NotePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NotePage({
  params,
}: NotePageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect individual notes.
  if (!user) {
    redirect("/login");
  }

  const [note, notes] = await Promise.all([
    getNote(id),
    getNotes(),
  ]);

  if (!note) {
    notFound();
  }

  return (
    <Workspace
      notes={notes}
      email={user.email ?? null}
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10 md:py-12">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <NoteTitle
              noteId={note.id}
              initialTitle={note.title}
            />
          </div>

          <DeleteNoteButton noteId={note.id} />
        </div>

        <Editor
          noteId={note.id}
          initialContent={note.content}
        />
      </div>
    </Workspace>
  );
}