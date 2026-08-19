"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Menu, X } from "lucide-react";

type Note = {
  id: string;
  title: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
};

type WorkspaceProps = {
  notes: Note[];
  email: string | null;
  children: React.ReactNode;
};

export default function Workspace({
  notes,
  email,
  children,
}: WorkspaceProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <main className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar notes={notes} email={email} />
      </div>

      {/* Mobile sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSidebarOpen(false)}
          />

          <div className="relative z-10 h-full w-72">
            <div className="absolute right-2 top-3 z-20">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded-md bg-background p-2 shadow-sm"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Sidebar notes={notes} email={email} />
          </div>
        </div>
      )}

      <section className="min-w-0 flex-1 overflow-y-auto">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex h-14 items-center border-b bg-background/95 px-4 backdrop-blur md:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-md p-2 hover:bg-muted"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <span className="ml-3 font-semibold">
            JisNote
          </span>
        </div>

        {children}
      </section>
    </main>
  );
}