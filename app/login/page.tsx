import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden p-6 md:p-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(20,184,166,0.24),transparent_45%),radial-gradient(circle_at_88%_4%,rgba(14,165,233,0.2),transparent_38%)]" />
      </div>
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border/70 bg-card/60 shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:grid-cols-2">
        <div className="hidden border-r border-border/70 bg-gradient-to-br from-cyan-500/20 via-teal-500/10 to-transparent p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Wissen Seats</p>
            <h2 className="mt-4 text-4xl font-bold leading-tight">Operate your workspace in the dark.</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">Plan weekly seat allocation, release unused capacity, and keep your squads coordinated from one control surface.</p>
        </div>
        <div className="p-6 md:p-10">
          <div className="mx-auto w-full max-w-sm reveal-up">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
