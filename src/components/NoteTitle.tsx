"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateNoteTitle } from "@/app/actions/notes";

type NoteTitleProps = {
  noteId: string;
  initialTitle: string;
};

export default function NoteTitle({
  noteId,
  initialTitle,
}: NoteTitleProps) {
  const router = useRouter();

  const [title, setTitle] = useState(
    initialTitle || "Untitled"
  );

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const newTitle = title.trim() || "Untitled";

      if (newTitle === initialTitle) {
        return;
      }

      try {
        setSaving(true);

        await updateNoteTitle(noteId, newTitle);

        router.refresh();
      } catch (error) {
        console.error("Failed to save title:", error);
      } finally {
        setSaving(false);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [title, noteId, initialTitle, router]);

  return (
    <div>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Untitled"
        className="w-full border-none bg-transparent text-4xl font-bold outline-none placeholder:text-muted-foreground"
        aria-label="Note title"
      />

      <div className="mt-2 h-5 text-xs text-muted-foreground">
        {saving && "Saving title..."}
      </div>
    </div>
  );
}