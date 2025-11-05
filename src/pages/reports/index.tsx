import {getMainContentHeight} from "@/shared/lib/styling";
import {useMemo, useState} from "react";

import {Card} from "@/shared/ui/card";
import {SelectMobile} from "@/shared/ui/select";

import {GAP_HEIGHT, REPORTS_PAGE_PADDING, SELECT_HEIGHT} from "./const/heights";
import {REPORT_OPTIONS, type ReportKey, REPORTS} from "./const/reports";

const ReportsPage = () => {
  const [activeReportKey, setActiveReportKey] = useState<ReportKey>("categories");

  const contentHeight = useMemo(
    () => getMainContentHeight() - REPORTS_PAGE_PADDING * 2 - SELECT_HEIGHT * 2 - GAP_HEIGHT * 2,
    []
  );

  return (
    <div style={{padding: REPORTS_PAGE_PADDING}}>
      <div className="flex flex-col justify-center items-center w-full" style={{marginBottom: GAP_HEIGHT}}>
        <SelectMobile
          className="w-30"
          title={"Выберите счёт"}
          placeholder={"Все счета"}
          onChange={() => {}}
          options={[]}
          hideSearch
        />
      </div>

      <div style={{marginBottom: GAP_HEIGHT}}>
        <SelectMobile
          title={"Выберите отчёт"}
          placeholder={"Выберите отчёт"}
          value={activeReportKey}
          onChange={setActiveReportKey as (v: string | null) => void}
          options={REPORT_OPTIONS}
          hideSearch
        />
      </div>

      <Card className="p-4 overflow-auto box-border" style={{height: contentHeight}}>
        {REPORTS[activeReportKey].render()}
      </Card>
    </div>
  );
};

export default ReportsPage;
