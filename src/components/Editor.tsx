"use client";

import { useEffect, useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { updateNoteContent } from "@/app/actions/notes";

type EditorProps = {
  noteId: string;
  initialContent: unknown;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function Editor({
  noteId,
  initialContent,
}: EditorProps) {
  const [mounted, setMounted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const editor = useCreateBlockNote();

  useEffect(() => {
    setMounted(true);

    if (
      Array.isArray(initialContent) &&
      initialContent.length > 0
    ) {
      try {
        editor.replaceBlocks(
          editor.document,
          initialContent as Parameters<
            typeof editor.replaceBlocks
          >[1]
        );
      } catch (error) {
        console.error("Failed to load note content:", error);
        setSaveStatus("error");
      }
    }
  }, [editor, initialContent]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    let timeout: ReturnType<typeof setTimeout> | undefined;

    const unsubscribe = editor.onChange(() => {
      setSaveStatus("idle");

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(async () => {
        try {
          setSaveStatus("saving");

          const content = editor.document;

          await updateNoteContent(noteId, content);

          setSaveStatus("saved");
        } catch (error) {
          console.error("Failed to save note:", error);
          setSaveStatus("error");
        }
      }, 800);
    });

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      unsubscribe();
    };
  }, [editor, mounted, noteId]);

  if (!mounted) {
    return (
      <div className="rounded-lg border p-8 text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex h-6 justify-end text-xs text-muted-foreground">
        {saveStatus === "saving" && "Saving..."}
        {saveStatus === "saved" && "Saved"}
        {saveStatus === "error" && "Save failed"}
      </div>

      <div className="min-h-[500px]">
        <BlockNoteView editor={editor} />
      </div>
    </div>
  );
}