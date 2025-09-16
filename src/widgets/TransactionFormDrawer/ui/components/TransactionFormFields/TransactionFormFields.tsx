import {useMemo} from "react";
import {useFormContext} from "react-hook-form";

import {CATEGORY_TYPE_OPTIONS, useCategories} from "@/entities/category";
import {DateConverter} from "@/shared/lib/datetime";
import {DatePickerMobile} from "@/shared/ui/date-picker";
import {FormControl, FormField, FormItem, FormLabel} from "@/shared/ui/form";
import {Input} from "@/shared/ui/input";
import {SelectMobile} from "@/shared/ui/select";
import {SegmentInput} from "@/shared/ui/tabs";
import {Textarea} from "@/shared/ui/textarea";

import {Avatar, AvatarFallback} from "@/shared/ui/avatar";
import {ChevronsUpDown} from "lucide-react";
import type {TransactionsFormState} from "../../../model/schema";

export const TransactionFormFields = () => {
  const {control, watch, setValue} = useFormContext<TransactionsFormState>();
  const categoryType = watch("categoryType");

  const {data: categories} = useCategories({type: categoryType});
  const categoriesOptions = useMemo(
    () =>
      categories?.map(c => ({label: `${c.shortName ? c.shortName + " - " : ""}${c.name}`, value: c.id, payload: c})) ??
      [],
    [categories]
  );

  return (
    <div className="flex flex-col gap-2">
      <FormField
        control={control}
        name="categoryId"
        render={({field}) => (
          <SelectMobile
            {...field}
            renderField={() => (
              <div className={"flex justify-center"}>
                <Avatar className={"h-[130px] w-[130px]"}>
                  <AvatarFallback className={"text-5xl"}>
                    {categoriesOptions.find(opt => opt.value === field.value)?.payload?.shortName ?? <ChevronsUpDown />}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            options={categoriesOptions}
            placeholder="Выберите категорию"
          />
        )}
      />

      <FormField
        control={control}
        name="amount"
        render={({field}) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                value={String(field.value)}
                onChange={e => field.onChange(Number(e.target.value))}
                type="number"
                min={0}
                inline
                placeholder={"0₽"}
                className={`h-auto w-full text-5xl font-bold text-center ${categoryType === "expense" ? "text-[var(--negative-accent)]" : "text-[var(--positive-accent)]"}`}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="categoryType"
        render={({field}) => (
          <FormItem>
            <FormLabel>Тип</FormLabel>
            <FormControl>
              <SegmentInput
                value={categoryType}
                className={"bg-transparent"}
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
        name="date"
        render={({field}) => (
          <FormItem>
            <FormLabel>Дата</FormLabel>
            <FormControl>
              <DatePickerMobile
                mode={"single"}
                value={field.value ? DateConverter.ISOToDate(field.value) : undefined}
                onChange={date => {
                  field.onChange(DateConverter.dateToISO(date));
                }}
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
              <Textarea className="max-h-[250px]" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
