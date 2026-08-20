"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

type EditorProps = {
  noteId: string;
  initialContent: unknown;
};

const BlockNoteEditor = dynamic(
  () => import("./BlockNoteEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-zinc-800 p-8 text-zinc-500">
        Loading editor...
      </div>
    ),
  }
);

export default function Editor({
  noteId,
  initialContent,
}: EditorProps) {
  return (
    <BlockNoteEditor
      noteId={noteId}
      initialContent={initialContent}
    />
  );
}