"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteNote } from "@/app/actions/notes";
import { Trash2 } from "lucide-react";

type DeleteNoteButtonProps = {
  noteId: string;
};

export default function DeleteNoteButton({
  noteId,
}: DeleteNoteButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await deleteNote(noteId);

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete note:", error);
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />

      {deleting ? "Deleting..." : "Delete note"}
    </button>
  );
}