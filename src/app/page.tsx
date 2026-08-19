import {
  FileText,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react";

const notes = [
  { id: 1, title: "Welcome to JisNote" },
  { id: 2, title: "My First Note" },
  { id: 3, title: "Project Ideas" },
];

export default function Home() {
  return (
    <main className="flex h-screen overflow-hidden bg-white text-zinc-900">
      {/* Sidebar */}
      <aside className="flex w-72 flex-col border-r border-zinc-200 bg-zinc-50">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-zinc-200 px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white">
              <FileText size={18} />
            </div>

            <span className="text-lg font-semibold tracking-tight">
              JisNote
            </span>
          </div>
        </div>

        {/* Sidebar actions */}
        <div className="p-3">
          <button className="flex w-full items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800">
            <Plus size={17} />
            New note
          </button>

          <button className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-200">
            <Search size={17} />
            Search
          </button>
        </div>

        {/* Notes */}
        <div className="flex-1 overflow-y-auto px-3">
          <p className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Notes
          </p>

          <div className="space-y-1">
            {notes.map((note) => (
              <button
                key={note.id}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-200"
              >
                <FileText size={16} className="shrink-0 text-zinc-400" />
                <span className="truncate">{note.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User area */}
        <div className="border-t border-zinc-200 p-3">
          <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-zinc-200">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200">
              <User size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Guest User</p>
              <p className="truncate text-xs text-zinc-500">
                Not signed in
              </p>
            </div>

            <Settings size={16} className="text-zinc-400" />
          </button>
        </div>
      </aside>

      {/* Main workspace */}
      <section className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 px-6">
          <div>
            <h1 className="text-sm font-medium text-zinc-500">
              Workspace
            </h1>
          </div>

          <div className="text-xs text-zinc-400">
            JisNote
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-md px-6 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
              <FileText size={30} className="text-zinc-500" />
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">
              Welcome to JisNote
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Create a note from the sidebar and start building your
              workspace.
            </p>

            <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800">
              <Plus size={17} />
              Create your first note
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}