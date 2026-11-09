import {CreditCard, Landmark, WalletCards} from "lucide-react";
import type {ChangeEvent} from "react";
import {useFormContext} from "react-hook-form";

import {CURRENCY_OPTIONS} from "@/entities/account";
import {cn} from "@/shared/lib/styling";
import {Card} from "@/shared/ui/card";
import {DetailRow} from "@/shared/ui/detail-row";
import {FormField, FormItem, FormMessage} from "@/shared/ui/form";
import {Input} from "@/shared/ui/input";
import {SelectMobile} from "@/shared/ui/select";
import {ValueEditorDrawer} from "@/shared/ui/value-editor-drawer";

import type {AccountFormState} from "../../../model/schema";

export const AccountFormFields = () => {
  const {control, watch} = useFormContext<AccountFormState>();
  const currencyCode = watch("currencyCode");

  return (
    <Card className="w-full gap-0 rounded-2xl border-border/70 bg-muted/30 p-2 shadow-none backdrop-blur-xl">
      <FormField
        control={control}
        name="name"
        render={({field, fieldState}) => (
          <FormItem className="gap-1">
            <ValueEditorDrawer
              title="Название счёта"
              trigger={
                <DetailRow
                  icon={<CreditCard />}
                  label="Название"
                  value={field.value || "Введите название"}
                  className={cn(fieldState.error && "text-destructive")}
                />
              }
            >
              <Input
                {...field}
                size="lg"
                maxLength={50}
                placeholder="Например, Основной счёт"
                className="rounded-2xl"
              />
              <FormMessage />
            </ValueEditorDrawer>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="startAmount"
        render={({field, fieldState}) => (
          <FormItem className="gap-1">
            <ValueEditorDrawer
              title="Начальный остаток"
              trigger={
                <DetailRow
                  icon={<WalletCards />}
                  label="Начальный остаток"
                  value={`${field.value} ₽`}
                  className={cn(fieldState.error && "text-destructive")}
                />
              }
            >
              <Input
                {...field}
                value={field.value ? String(field.value) : ""}
                onChange={(event: ChangeEvent<HTMLInputElement>) => field.onChange(Number(event.target.value))}
                type="number"
                min={0}
                size="lg"
                placeholder="0"
                className="rounded-2xl"
              />
              <FormMessage />
            </ValueEditorDrawer>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="currencyCode"
        render={({field}) => (
          <FormItem className="gap-1">
            <SelectMobile
              {...field}
              renderField={() => (
                <DetailRow
                  icon={<Landmark />}
                  label="Валюта"
                  value={CURRENCY_OPTIONS.find(option => option.value === currencyCode)?.label ?? "Выберите валюту"}
                />
              )}
              options={CURRENCY_OPTIONS}
              title="Выберите валюту"
              placeholder="Выберите валюту"
            />
            <FormMessage className="px-3" />
          </FormItem>
        )}
      />
    </Card>
  );
};
