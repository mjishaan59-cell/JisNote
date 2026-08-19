"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const handleGitHubLogin = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">JisNote</h1>
          <p className="text-muted-foreground">
            Your modern workspace for notes.
          </p>
        </div>

        <button
          onClick={handleGitHubLogin}
          className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800"
        >
          Continue with GitHub
        </button>
      </div>
    </main>
  );
}