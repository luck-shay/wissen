interface ContextBannerProps {
  userIsDesignated: boolean;
  canBookNonDesignated: boolean;
}

export function ContextBanner({ userIsDesignated, canBookNonDesignated }: ContextBannerProps) {
  if (userIsDesignated) {
    return (
      <div className="glass-panel reveal-up mb-3 rounded-2xl border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200">
        <span className="mr-2 inline-flex rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]">
          Designated Day
        </span>
        <strong>Your seat is reserved.</strong> Vacate it if you are not coming in so others can use it.
      </div>
    );
  }

  return (
    <div
      className={`glass-panel reveal-up mb-3 rounded-2xl border px-4 py-3 text-sm ${
        canBookNonDesignated
          ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-200"
          : "border-amber-500/40 bg-amber-500/10 text-amber-200"
      }`}
    >
      {canBookNonDesignated
        ? "Today is not your designated day. You can book any available floater or released seats right now."
        : "Not your designated day. Floater and released seats open for booking after 3 PM today."}
    </div>
  );
}
