import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

export type AppNavItem = {
  to: string;
  label: string;
  Icon: LucideIcon;
};

type LayoutProps = {
  navItems: readonly AppNavItem[] | AppNavItem[];
  logoIcon?: LucideIcon;
  logoImageSrc?: string;
  menuIcon: LucideIcon;
  closeIcon: LucideIcon;
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-stem-500/15 text-stem-300"
      : "text-slate-300 hover:bg-white/5 hover:text-white",
  ].join(" ");

export function Layout({
  navItems,
  logoIcon: LogoIcon,
  logoImageSrc,
  menuIcon: MenuIcon,
  closeIcon: CloseIcon,
}: LayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md"
        style={{
          backgroundColor: `color-mix(in srgb, var(--color-surface) 82%, transparent)`,
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 text-white"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-9 w-9 items-center justify-center">
              {logoImageSrc ? (
                <img
                  src={logoImageSrc}
                  alt="seedu logo"
                  className="h-9 w-9 object-contain"
                />
              ) : LogoIcon ? (
                <LogoIcon size={20} className="text-white" aria-hidden />
              ) : null}
            </span>
            <span 
              className="font-semibold"
              style={{
                backgroundImage: 'linear-gradient(to right, #60a5fa, #06b6d4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent'
              }}
            >
              seedu
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={navLinkClass}
                end={to === "/" || to === "/events"}
              >
                <span className="flex items-center gap-1.5">
                  <Icon size={20} className="opacity-80" aria-hidden />
                  {label}
                </span>
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-white/15 p-2 text-slate-200 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <CloseIcon size={20} aria-hidden />
            ) : (
              <MenuIcon size={20} aria-hidden />
            )}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>

        {open ? (
          <div
            id="mobile-nav"
            className="border-t border-white/10 bg-[var(--color-surface)] px-4 py-3 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navItems.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={navLinkClass}
                  end={to === "/" || to === "/events"}
                  onClick={() => setOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={20} aria-hidden />
                    {label}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer
        className="border-t border-white/10"
        style={{ backgroundColor: "var(--color-surface-900)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p 
              className="font-semibold"
              style={{
                backgroundImage: 'linear-gradient(to right, #60a5fa, #06b6d4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent'
              }}
            >seedu</p>
            <p className="mt-1 max-w-md text-sm text-slate-400">
              A non-profit opening doors to science, technology, engineering, and
              mathematics—with rigor, care, and belonging.
            </p>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} seedu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
