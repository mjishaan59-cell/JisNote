"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createNote } from "@/app/actions/notes";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  LogOut,
  Plus,
  PanelLeftClose,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Note = {
  id: string;
  title: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
};

type SidebarProps = {
  notes: Note[];
  email: string | null;
};

export default function Sidebar({
  notes,
  email,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [creating, setCreating] = useState(false);

  const [expanded, setExpanded] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const supabase = createClient();

    const channelName =
      `notes-realtime-${crypto.randomUUID()}`;

    const channel = supabase.channel(channelName);

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notes",
      },
      () => {
        router.refresh();
      }
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const childrenByParent = useMemo(() => {
    const map = new Map<string | null, Note[]>();

    for (const note of notes) {
      const parent = note.parent_id ?? null;

      if (!map.has(parent)) {
        map.set(parent, []);
      }

      map.get(parent)!.push(note);
    }

    return map;
  }, [notes]);

  const toggleExpanded = (noteId: string) => {
    setExpanded((current) => {
      const next = new Set(current);

      if (next.has(noteId)) {
        next.delete(noteId);
      } else {
        next.add(noteId);
      }

      return next;
    });
  };

  const handleCreateNote = async (
    parentId?: string
  ) => {
    try {
      setCreating(true);

      const note = await createNote(parentId);

      if (parentId) {
        setExpanded((current) => {
          const next = new Set(current);

          next.add(parentId);

          return next;
        });
      }

      router.push(`/notes/${note.id}`);
      router.refresh();
    } catch (error) {
      console.error(
        "Failed to create note:",
        error
      );
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  };

  const renderNotes = (
    parentId: string | null = null,
    depth = 0
  ): React.ReactNode => {
    const children =
      childrenByParent.get(parentId) ?? [];

    return children.map((note) => {
      const active =
        pathname === `/notes/${note.id}`;

      const childNotes =
        childrenByParent.get(note.id) ?? [];

      const hasChildren =
        childNotes.length > 0;

      const isExpanded =
        expanded.has(note.id);

      return (
        <div key={note.id}>
          <div
            className="flex items-center gap-1"
            style={{
              paddingLeft: `${depth * 16}px`,
            }}
          >
            {hasChildren ? (
              <button
                type="button"
                onClick={() =>
                  toggleExpanded(note.id)
                }
                className="shrink-0 rounded-md p-1 hover:bg-muted"
                aria-label={
                  isExpanded
                    ? "Collapse note"
                    : "Expand note"
                }
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="w-6 shrink-0" />
            )}

            <Link
              href={`/notes/${note.id}`}
              className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2 text-sm transition ${
                active
                  ? "bg-muted font-medium"
                  : "hover:bg-muted/70"
              }`}
            >
              <FileText className="h-4 w-4 shrink-0" />

              <span className="truncate">
                {note.title || "Untitled"}
              </span>
            </Link>

            <button
              type="button"
              onClick={() =>
                handleCreateNote(note.id)
              }
              disabled={creating}
              className="shrink-0 rounded-md p-1.5 opacity-70 hover:bg-muted hover:opacity-100 disabled:opacity-40"
              title="Create child note"
              aria-label="Create child note"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {isExpanded &&
            renderNotes(note.id, depth + 1)}
        </div>
      );
    });
  };

  if (collapsed) {
    return (
      <aside className="flex w-16 flex-col items-center border-r bg-card py-4">
        <button
          onClick={() => setCollapsed(false)}
          className="rounded-md p-2 hover:bg-muted"
          title="Open sidebar"
        >
          <PanelLeftClose className="h-5 w-5 rotate-180" />
        </button>

        <button
          onClick={() => handleCreateNote()}
          disabled={creating}
          className="mt-6 rounded-md p-2 hover:bg-muted disabled:opacity-50"
          title="New note"
        >
          <Plus className="h-5 w-5" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex h-screen w-72 flex-col border-r bg-card">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <Link
          href="/dashboard"
          className="text-xl font-bold"
        >
          JisNote
        </Link>

        <button
          onClick={() => setCollapsed(true)}
          className="rounded-md p-2 hover:bg-muted"
          title="Collapse sidebar"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>
      </div>

      <div className="p-3">
        <button
          onClick={() => handleCreateNote()}
          disabled={creating}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />

          {creating
            ? "Creating..."
            : "New Note"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          My Notes
        </div>

        <div className="space-y-1">
          {notes.length === 0 ? (
            <p className="px-2 py-4 text-sm text-muted-foreground">
              No notes yet.
            </p>
          ) : (
            renderNotes()
          )}
        </div>
      </div>

      <div className="border-t p-3">
        <div className="mb-2 truncate px-2 text-sm text-muted-foreground">
          {email || "User"}
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-muted"
        >
          <LogOut className="h-4 w-4" />

          Sign out
        </button>
      </div>
    </aside>
  );
}