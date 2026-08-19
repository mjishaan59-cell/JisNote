import { getNotes } from "@/app/actions/notes";
import { createClient } from "@/lib/supabase/server";
import Workspace from "@/components/Workspace";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const notes = await getNotes();

  return (
    <Workspace
      notes={notes}
      email={user?.email ?? null}
    >
      <div className="flex min-h-full items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            Welcome to JisNote
          </h1>

          <p className="mt-3 text-muted-foreground">
            Select a note from the sidebar or create a new one.
          </p>
        </div>
      </div>
    </Workspace>
  );
}