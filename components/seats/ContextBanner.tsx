interface ContextBannerProps {
  userIsDesignated: boolean;
  canBookNonDesignated: boolean;
}

export function ContextBanner({ userIsDesignated, canBookNonDesignated }: ContextBannerProps) {
  if (userIsDesignated) {
    return (
      <div className="mb-5 rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm text-green-700 dark:text-green-400">
        ✅ <strong>Your designated day.</strong> Your seat is reserved. Vacate
        it if you&apos;re not coming in so others can use it.
      </div>
    );
  }

  return (
    <div
      className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
        canBookNonDesignated
          ? "border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-400"
          : "border-yellow-500/30 bg-yellow-500/5 text-yellow-700 dark:text-yellow-500"
      }`}
    >
      {canBookNonDesignated
        ? "🟦 Not your designated day. Available floater and released seats can be booked now."
        : "🔒 Not your designated day. Floater and released seats open for booking after 3 PM today."}
    </div>
  );
}
