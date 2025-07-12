import {useMemo} from "react";
import {useFormContext} from "react-hook-form";

import {CATEGORY_TYPE_OPTIONS, useCategories} from "@/entities/category";
import {FormControl, FormField, FormItem, FormLabel} from "@/shared/ui/form.tsx";
import {Input, NumericInput} from "@/shared/ui/input.tsx";
import {SelectInput} from "@/shared/ui/select.tsx";
import {SegmentInput} from "@/shared/ui/tabs.tsx";

import {Calendar} from "@/shared/ui/calendar.tsx";
import type {TransactionsFormState} from "../../../model/schema.ts";

export const TransactionFormFields = () => {
  const {control, watch, setValue} = useFormContext<TransactionsFormState>();
  const categoryType = watch("categoryType");

  const {data: categories} = useCategories(categoryType);
  const categoriesOptions = useMemo(() => categories?.map(c => ({label: c.name, value: c.id})) ?? [], [categories]);

  return (
    <>
      <FormField
        control={control}
        name="categoryType"
        render={({field}) => (
          <FormItem>
            <FormControl>
              <SegmentInput
                value={categoryType}
                onChange={type => {
                  field.onChange(type);
                  setValue("categoryId", "");
                }}
                options={CATEGORY_TYPE_OPTIONS}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="amount"
        render={({field}) => (
          <FormItem>
            <FormControl>
              <div className={"flex justify-end items-center"}>
                <NumericInput
                  min={0}
                  {...field}
                  className={`border-none w-full p-0 m-0 shadow-none h-auto text-6xl font-bold text-right ${categoryType === "expense" ? "text-[#ef4444]" : "text-[#22c55e]"}`}
                />
                <h1 className={"text-6xl font-bold"}>₽</h1>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="categoryId"
        render={({field}) => (
          <FormItem>
            <FormLabel>Категория</FormLabel>
            <FormControl>
              <SelectInput {...field} options={categoriesOptions} placeholder="Выберите категорию" />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="date"
        render={({field}) => (
          <FormItem>
            <FormLabel>Дата</FormLabel>
            <FormControl>
              <Calendar
                style={{width: "100%"}}
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={date => {
                  field.onChange(date?.toUTCString());
                }}
                className="rounded-lg border"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="comment"
        render={({field}) => (
          <FormItem>
            <FormLabel>Комментарий</FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
