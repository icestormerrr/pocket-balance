import {BOTTOM_BAR_HEIGHT, cn} from "@/shared/lib/styling";
import {CircleEllipsis, PieChart, Rows4, WalletCards} from "lucide-react";

import {URLS} from "@/shared/const/urls";
import {Link, useRouterState} from "@tanstack/react-router";
import {CreateOperationButton} from "./components/CreateOperationButton";

const navItems = [
  {label: "Счета", icon: WalletCards, link: URLS.AccountsPage.build()},
  {label: "Операции", icon: Rows4, link: URLS.TransactionsPage.build()},
  {
    content: (
      <div className="flex justify-center">
        <CreateOperationButton key="central" className="mt-[-5px]" />
      </div>
    ),
  },
  {label: "Отчёты", icon: PieChart, link: URLS.ReportsPage.build()},
  {label: "Ещё", icon: CircleEllipsis, link: URLS.MorePage.build()},
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
        {navItems.map(({label, icon: Icon, link, content}, idx) =>
          content ? (
            content
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
