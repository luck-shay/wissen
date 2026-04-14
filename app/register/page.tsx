import { RegisterForm } from "@/components/register-form";

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden p-6 md:p-10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(16,185,129,0.25),transparent_42%),radial-gradient(circle_at_90%_20%,rgba(6,182,212,0.22),transparent_40%)]" />
      </div>
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border/70 bg-card/60 shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:grid-cols-2">
        <div className="hidden border-r border-border/70 bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">Wissen Seats</p>
            <h2 className="mt-4 text-4xl font-bold leading-tight">Create your operator profile.</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">Join your squad, unlock seat workflows, and manage occupancy with real-time visibility.</p>
        </div>
        <div className="p-6 md:p-10">
          <div className="mx-auto w-full max-w-sm reveal-up">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}