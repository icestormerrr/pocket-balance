import {cn} from "@/shared/lib/styling";
import {CircleEllipsis, LayoutList, PieChart, SlidersHorizontal} from "lucide-react";

import {Link, useRouterState} from "@tanstack/react-router";
import {CreateOperationButton} from "./components/CreateOperationButton";

const navItems = [
  {label: "Операции", icon: LayoutList, link: "/transactions"},
  {label: "Отчёт", icon: PieChart, link: "/reports"},
  {central: true},
  {label: "План", icon: SlidersHorizontal},
  {label: "Настройки", icon: CircleEllipsis, link: "more"},
];

export function BottomBar() {
  const location = useRouterState({select: s => s.location});
  const pathname = location.pathname;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 h-20 flex items-center justify-center bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-md mx-auto flex justify-around items-center px-4">
        {navItems.map(({label, icon: Icon, link, central}, idx) =>
          central ? (
            <CreateOperationButton key="central" className="mt-[-5px]" />
          ) : (
            <Link
              key={idx}
              to={link ?? "/"}
              className={cn("flex flex-col items-center justify-center text-xs", pathname !== link && "text-zinc-400")}
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span className="mt-1">{label}</span>
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
