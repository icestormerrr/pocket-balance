import {Link, useRouterState} from "@tanstack/react-router";
import {Bolt, ChartCandlestick, Landmark, Rows4} from "lucide-react";

import {URLS} from "@/ui/shared/const/urls";
import {SegmentItem, SegmentList} from "@/ui/shared/ui/segment-input";
import classNames from "./bottom-bar.module.css";
import {CreateOperationButton} from "./components/CreateOperationButton";

const navItems = [
  {label: "Счета", icon: Landmark, link: URLS.AccountsPage.build()},
  {label: "Операции", icon: Rows4, link: URLS.TransactionsPage.build()},
  {label: "Отчёты", icon: ChartCandlestick, link: URLS.ReportsPage.build()},
  {label: "Ещё", icon: Bolt, link: URLS.MorePage.build()},
];

export function BottomBar() {
  const pathname = useRouterState({select: s => s.location.pathname});
  const activePathname = pathname === URLS.MainPage.path ? URLS.TransactionsPage.path : pathname;

  return (
    <nav aria-label="Основная навигация" className={classNames.bottomBar}>
      <SegmentList size="lg" className={classNames.items}>
        {navItems.map(({label, icon: Icon, link}) => (
          <SegmentItem key={link} active={activePathname === link} asChild>
            <Link to={link} aria-current={activePathname === link ? "page" : undefined}>
              <span className={classNames.content}>
                <Icon aria-hidden="true" strokeWidth={1.8} />
                <span>{label}</span>
              </span>
            </Link>
          </SegmentItem>
        ))}
      </SegmentList>
      <CreateOperationButton />
    </nav>
  );
}
