interface Props {
  label?: string;
  value?: number;
  target?: number;
}

export function ProgressBar(
  { label = "", value = 0, target = 0 }: Props,
) {
  const percentage = target ? Math.round(value / target * 100) : 0;
  const clamped = Math.max(0, Math.min(percentage, 100));

  return (
    <div className="rounded-full overflow-hidden bg-indigo-300 dark:bg-indigo-900 relative">
      <div
        data-animated={clamped !== 0}
        className="absolute left-0 top-0 bottom-0 bg-indigo-500 rounded-full scale-x-0 data-[animated=true]:scale-x-100 transition-transform duration-500 origin-left"
        style={{
          width: clamped + "%",
        }}
      >
      </div>
      <p
        data-label={label !== ""}
        className="text-sm font-bold z-10 isolate px-3 py-1 text-white data-[label=false]:opacity-0"
      >
        {label === "" ? "Loading..." : label}
      </p>
    </div>
  );
}
