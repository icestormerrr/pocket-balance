import {getMainContentHeight} from "@/shared/lib/styling";
import {useMemo, useState} from "react";

import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator} from "@/shared/ui/breadcrumb";
import {Card} from "@/shared/ui/card";
import {SelectInput} from "@/shared/ui/select";

import {BREADCRUMBS_HEIGHT, REPORTS_PAGE_PADDING} from "./const/heights";
import {REPORT_OPTIONS, type ReportKey, REPORTS} from "./const/reports";

const ReportsPage = () => {
  const [activeReportKey, setActiveReportKey] = useState<ReportKey>("categories");

  const contentHeight = useMemo(() => getMainContentHeight() - REPORTS_PAGE_PADDING * 2 - BREADCRUMBS_HEIGHT, []);

  return (
    <div style={{padding: REPORTS_PAGE_PADDING}} className="space-y-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="cursor-default">Отчёты</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <SelectInput
              title={"Выберите отчёт"}
              placeholder={"Выберите отчёт"}
              value={activeReportKey}
              onChange={setActiveReportKey as (v: string | null) => void}
              options={REPORT_OPTIONS}
              hideSearch
            />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="p-4 overflow-auto box-border" style={{height: contentHeight}}>
        {REPORTS[activeReportKey].render()}
      </Card>
    </div>
  );
};

export default ReportsPage;
