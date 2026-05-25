import {ArrowDownRight, ArrowUpRight, Minus} from "lucide-react";

import {Badge} from "@/shared/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/shared/ui/card";

export function formatCurrency(value: number) {
  return `${value.toLocaleString("ru-RU").replace(/,/g, " ")} ₽`;
}

export function formatPercent(value: number | null, digits = 1) {
  if (value === null) return "новый период";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function ReportSectionHeader({title, description}: {title: string; description: string}) {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-semibold tracking-[-0.03em]">{title}</h2>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: string;
  tone?: "positive" | "negative" | "neutral";
  hint?: string;
}) {
  const toneClass =
    tone === "positive"
      ? "text-[var(--positive-accent)]"
      : tone === "negative"
        ? "text-[var(--negative-accent)]"
        : "text-foreground";

  return (
    <Card className="gap-3 rounded-[1.5rem] border-border/70 py-4 shadow-none">
      <CardHeader className="px-4 pb-0">
        <CardTitle className="text-muted-foreground text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <div className={`text-2xl font-semibold tracking-[-0.03em] ${toneClass}`}>{value}</div>
        {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function DeltaBadge({value}: {value: number | null}) {
  if (value === null) {
    return <Badge variant="outline">Новый период</Badge>;
  }

  if (value === 0) {
    return (
      <Badge variant="outline" className="gap-1">
        <Minus className="size-3" />
        0%
      </Badge>
    );
  }

  const isPositive = value > 0;

  return (
    <Badge variant={isPositive ? "default" : "outline"} className="gap-1">
      {isPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
      {formatPercent(value)}
    </Badge>
  );
}

export function EmptyReportState({title}: {title: string}) {
  return (
    <Card className="rounded-[1.5rem] border-dashed border-border/80 py-10 shadow-none">
      <CardContent className="px-4 text-center">
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground mt-2 text-sm">Недостаточно данных за выбранный период.</p>
      </CardContent>
    </Card>
  );
}
