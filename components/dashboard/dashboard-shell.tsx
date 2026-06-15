type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <div
        className="flex items-center border-b border-border-subtle pb-4"
        aria-hidden
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-sage">
          Home
        </p>
      </div>
      {children}
    </div>
  );
}
