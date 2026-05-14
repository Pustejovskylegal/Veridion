"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Radar,
  FileSearch,
  ShieldCheck,
  Users,
  GitCompare,
  Settings,
  Bell,
  Search,
  Sparkles,
} from "lucide-react";
import { Logo } from "../Logo";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Přehled", href: "/workspace", icon: LayoutDashboard },
  { label: "Monitoring", href: "/workspace/monitoring", icon: Radar, badge: "24" },
  { label: "Analýza", href: "/workspace/analyza", icon: FileSearch },
  { label: "Změny", href: "/workspace/zmeny", icon: GitCompare, badge: "3", highlight: true },
  { label: "Compliance", href: "/workspace/compliance", icon: ShieldCheck },
  { label: "Tým", href: "/workspace/tym", icon: Users },
];

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-ink-950 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-white/[0.05] bg-ink-900/40">
        <div className="px-5 py-5 border-b border-white/[0.04]">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="h-6 w-6" />
            <span className="text-[15px] font-medium tracking-tight text-silver-50">
              Veridion
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4">
          <div className="px-2 mb-2 text-[10px] uppercase tracking-[0.16em] text-silver-500">
            Workspace
          </div>
          <ul className="space-y-0.5">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between rounded-md px-2.5 py-2 text-[13px] transition-colors",
                      active
                        ? "bg-white/[0.06] text-silver-50"
                        : "text-silver-300 hover:bg-white/[0.03] hover:text-silver-100"
                    )}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5",
                          active ? "text-accent-400" : "text-silver-500 group-hover:text-silver-300"
                        )}
                      />
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[9.5px] font-medium",
                          item.highlight
                            ? "bg-amber-400/10 text-amber-300"
                            : "bg-white/[0.06] text-silver-300"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-white/[0.04]">
          <Link
            href="/workspace/nastaveni"
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-silver-300 hover:bg-white/[0.03] hover:text-silver-100 transition-colors"
          >
            <Settings className="h-3.5 w-3.5 text-silver-500" />
            Nastavení
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between gap-4 px-6 py-3.5 border-b border-white/[0.05] bg-ink-950/80 backdrop-blur sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Search className="h-3.5 w-3.5 text-silver-500" />
            <input
              type="text"
              placeholder="Hledat tendry, dokumenty, lidé…"
              className="flex-1 bg-transparent text-[13px] text-silver-100 placeholder:text-silver-500 outline-none"
            />
            <span className="rounded bg-white/[0.04] border border-white/[0.05] px-1.5 py-0.5 text-[10px] text-silver-400">
              ⌘K
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 px-3 py-1.5 text-[12px] hover:bg-accent-500/15 transition-colors">
              <Sparkles className="h-3 w-3" />
              Zeptat se AI
            </button>
            <button className="p-1.5 rounded-md text-silver-400 hover:text-silver-100 hover:bg-white/[0.04] transition-colors">
              <Bell className="h-4 w-4" />
            </button>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-7 w-7 ring-1 ring-white/[0.08]",
                },
              }}
            />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
