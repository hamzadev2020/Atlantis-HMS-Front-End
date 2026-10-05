export const DashboardKpiCard = ({ label, value, detail, color = "#4f46e5" }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
    </div>
    <strong className="mt-2 block text-2xl font-bold text-slate-800">{value}</strong>
    <span className="mt-1 block text-xs text-slate-500">{detail}</span>
  </article>
);

export const DashboardBarChart = ({ title, subtitle, items, loading = false, accent = "#6d28d9" }) => {
  const maxValue = Math.max(1, ...items.map((item) => item.value));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className="space-y-4" role="list" aria-label={title}>
        {items.map((item) => (
          <div key={item.label} role="listitem">
            <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-600">{item.label}</span>
              <strong className="text-slate-800">{loading ? "—" : item.value}</strong>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${loading ? 0 : item.value ? Math.max((item.value / maxValue) * 100, 3) : 0}%`,
                  backgroundColor: item.color || accent,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
