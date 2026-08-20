"use client";

import { useEffect, useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { updateNoteContent } from "@/app/actions/notes";

type BlockNoteEditorProps = {
  noteId: string;
  initialContent: unknown;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function BlockNoteEditor({
  noteId,
  initialContent,
}: BlockNoteEditorProps) {
  const [saveStatus, setSaveStatus] =
    useState<SaveStatus>("idle");

  const editor = useCreateBlockNote();

  useEffect(() => {
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
        console.error(
          "Failed to load note content:",
          error
        );
        setSaveStatus("error");
      }
    }
  }, [editor, initialContent]);

  useEffect(() => {
    let timeout:
      | ReturnType<typeof setTimeout>
      | undefined;

    const unsubscribe = editor.onChange(() => {
      setSaveStatus("idle");

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(async () => {
        try {
          setSaveStatus("saving");

          await updateNoteContent(
            noteId,
            editor.document
          );

          setSaveStatus("saved");
        } catch (error) {
          console.error(
            "Failed to save note:",
            error
          );
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
  }, [editor, noteId]);

  return (
    <div className="w-full">
      <div className="mb-3 flex h-6 justify-end text-xs text-zinc-500">
        {saveStatus === "saving" && "Saving..."}
        {saveStatus === "saved" && "Saved"}
        {saveStatus === "error" && "Save failed"}
      </div>

      <div className="min-h-[400px] w-full overflow-x-auto rounded-lg">
        <BlockNoteView editor={editor} />
      </div>
    </div>
  );
}