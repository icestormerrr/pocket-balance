import {BOTTOM_BAR_HEIGHT, cn} from "@/shared/lib/styling";
import {CircleEllipsis, LayoutList, PieChart, SlidersHorizontal} from "lucide-react";

import {Link, useRouterState} from "@tanstack/react-router";
import {CreateOperationButton} from "./components/CreateOperationButton";

const navItems = [
  {label: "Операции", icon: LayoutList, link: "/transactions"},
  {label: "Отчёт", icon: PieChart, link: "/reports"},
  {central: true},
  {label: "План", icon: SlidersHorizontal},
  {label: "Ещё", icon: CircleEllipsis, link: "more"},
];

export function BottomBar() {
  const location = useRouterState({select: s => s.location});
  const pathname = location.pathname;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{height: BOTTOM_BAR_HEIGHT}}
    >
      <div className={`w-full max-w-md mx-auto grid grid-cols-5 px-4`}>
        {navItems.map(({label, icon: Icon, link, central}, idx) =>
          central ? (
            <div className="flex justify-center">
              <CreateOperationButton key="central" className="mt-[-5px]" />
            </div>
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
