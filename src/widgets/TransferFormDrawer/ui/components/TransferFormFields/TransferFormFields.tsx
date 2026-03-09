import {ChevronRight} from "lucide-react";
import {useMemo} from "react";
import {useFormContext} from "react-hook-form";

import {useAccounts} from "@/entities/account";
import {DateConverter} from "@/shared/lib/datetime";
import {Card} from "@/shared/ui/card";
import {Cell} from "@/shared/ui/cell";
import {DatePickerMobile} from "@/shared/ui/date-picker";
import {FormControl, FormField, FormItem} from "@/shared/ui/form";
import {Input} from "@/shared/ui/input";
import {SelectMobile} from "@/shared/ui/select";

import type {TransferFormState} from "../../../model/schema";

export const TransferFormFields = () => {
  const {control, watch} = useFormContext<TransferFormState>();

  const fromAccountId = watch("fromAccountId");

  const {data: accounts} = useAccounts({});
  const accountsOptions = useMemo(
    () => accounts?.map(acc => ({label: acc.name, value: acc.id, payload: acc})) ?? [],
    [accounts]
  );

  const toAccountOptions = useMemo(
    () => accountsOptions.filter(account => account.value !== fromAccountId),
    [accountsOptions, fromAccountId]
  );

  return (
    <div className="flex flex-col gap-6">
      <FormField
        control={control}
        name="amount"
        render={({field}) => (
          <FormItem className={"mb-5 mt-20"}>
            <FormControl>
              <Input
                {...field}
                value={String(field.value)}
                onChange={e => field.onChange(Number(e.target.value))}
                type="number"
                min={0}
                inline
                placeholder={"0"}
                className="h-auto w-full text-5xl font-bold text-center"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <Card className="w-full rounded-xl p-4">
        <FormField
          control={control}
          name="fromAccountId"
          render={({field}) => (
            <SelectMobile
              {...field}
              renderField={() => (
                <div>
                  <Cell>
                    <Cell.Content>
                      <Cell.Content.Title>Со счёта</Cell.Content.Title>
                      {field.value && (
                        <Cell.Content.Subtitle>
                          {accountsOptions.find(opt => opt.value === field.value)?.label}
                        </Cell.Content.Subtitle>
                      )}
                    </Cell.Content>
                    <Cell.RightContent>
                      <ChevronRight />
                    </Cell.RightContent>
                  </Cell>
                </div>
              )}
              hideSearch
              options={accountsOptions}
              title="Выберите счёт списания"
              placeholder="Выберите счёт списания"
            />
          )}
        />

        <FormField
          control={control}
          name="toAccountId"
          render={({field}) => (
            <SelectMobile
              {...field}
              renderField={() => (
                <div>
                  <Cell>
                    <Cell.Content>
                      <Cell.Content.Title>На счёт</Cell.Content.Title>
                      {field.value && (
                        <Cell.Content.Subtitle>
                          {accountsOptions.find(opt => opt.value === field.value)?.label}
                        </Cell.Content.Subtitle>
                      )}
                    </Cell.Content>
                    <Cell.RightContent>
                      <ChevronRight />
                    </Cell.RightContent>
                  </Cell>
                </div>
              )}
              hideSearch
              options={toAccountOptions}
              title="Выберите счёт зачисления"
              placeholder="Выберите счёт зачисления"
            />
          )}
        />

        <FormField
          control={control}
          name="date"
          render={({field}) => (
            <DatePickerMobile
              mode={"single"}
              value={field.value ? DateConverter.ISOToDate(field.value) : undefined}
              onChange={date => {
                field.onChange(DateConverter.dateToISO(date));
              }}
            >
              <div>
                <Cell>
                  <Cell.Content>
                    <Cell.Content.Title>Дата</Cell.Content.Title>
                    {field.value && (
                      <Cell.Content.Subtitle>
                        {DateConverter.ISOToFormattedString(field.value, "DD.MM.YYYY")}
                      </Cell.Content.Subtitle>
                    )}
                  </Cell.Content>
                  <Cell.RightContent>
                    <ChevronRight />
                  </Cell.RightContent>
                </Cell>
              </div>
            </DatePickerMobile>
          )}
        />
      </Card>
    </div>
  );
};

