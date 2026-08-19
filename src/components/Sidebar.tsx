"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createNote } from "@/app/actions/notes";
import { FileText, LogOut, Plus, PanelLeftClose } from "lucide-react";
import { useEffect, useState } from "react";

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

export default function Sidebar({ notes, email }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [creating, setCreating] = useState(false);

  // Listen for note changes from Supabase Realtime
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("notes-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const handleCreateNote = async () => {
    try {
      setCreating(true);

      const note = await createNote();

      router.push(`/notes/${note.id}`);
      router.refresh();
    } catch (error) {
      console.error("Failed to create note:", error);
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
          onClick={handleCreateNote}
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
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-4">
        <Link href="/dashboard" className="text-xl font-bold">
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

      {/* New Note */}
      <div className="p-3">
        <button
          onClick={handleCreateNote}
          disabled={creating}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />

          {creating ? "Creating..." : "New Note"}
        </button>
      </div>

      {/* Notes */}
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
            notes.map((note) => {
              const active = pathname === `/notes/${note.id}`;

              return (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
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
              );
            })
          )}
        </div>
      </div>

      {/* User */}
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