import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  label: string;
  suffix?: string;
  durationMs?: number;
};

export function StatCounter({
  value,
  label,
  suffix = "",
  durationMs = 1400,
}: Props) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();

        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = 1 - (1 - t) ** 3;
          setDisplay(Math.round(value * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [value, durationMs]);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/10 bg-surface-850/60 p-6 text-center"
    >
      <p className="font-mono text-4xl font-bold tabular-nums text-stem-300 sm:text-5xl">
        {display.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-400">{label}</p>
    </div>
  );
}
