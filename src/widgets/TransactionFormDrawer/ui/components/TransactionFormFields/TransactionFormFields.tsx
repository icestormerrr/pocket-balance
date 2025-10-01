import {useMemo} from "react";
import {useFormContext} from "react-hook-form";

import {CATEGORY_TYPE_OPTIONS, useCategories} from "@/entities/category";
import {DateConverter} from "@/shared/lib/datetime";
import {FormControl, FormField, FormItem} from "@/shared/ui/form";
import {Input} from "@/shared/ui/input";
import {SelectMobile} from "@/shared/ui/select";
import {SegmentInput} from "@/shared/ui/tabs";
import {Textarea} from "@/shared/ui/textarea";

import {Avatar, AvatarFallback} from "@/shared/ui/avatar";
import {Card} from "@/shared/ui/card";
import {DatePickerMobile} from "@/shared/ui/date-picker";
import {Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/shared/ui/drawer";
import {ChevronRight, ChevronsUpDown} from "lucide-react";
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
      <Card className="w-full max-w-md rounded-xl shadow-sm cursor-pointer p-4">
        <FormField
          control={control}
          name="categoryType"
          render={({field}) => (
            <div className="flex items-center gap-3 p-0">
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Тип</p>
              </div>
              <SegmentInput
                value={categoryType}
                onChange={type => {
                  field.onChange(type);
                  setValue("categoryId", "");
                }}
                options={CATEGORY_TYPE_OPTIONS}
              />
            </div>
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
              <div className="flex items-center gap-3 p-0">
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Дата</p>
                  {field.value && (
                    <p className="text-xs text-muted-foreground truncate">
                      {DateConverter.ISOToFormattedString(field.value, "DD.MM.YYYY")}
                    </p>
                  )}
                </div>

                <ChevronRight />
              </div>
            </DatePickerMobile>
          )}
        />

        <FormField
          control={control}
          name="comment"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Drawer repositionInputs={false}>
                  <DrawerTrigger asChild>
                    <div className="flex items-center gap-3 p-0">
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Комментарий</p>
                        {field.value && <p className="text-xs text-muted-foreground truncate">{field.value}</p>}
                      </div>

                      <ChevronRight />
                    </div>
                  </DrawerTrigger>

                  <DrawerContent className="px-4 pb-4 min-h-[80vh]">
                    <DrawerHeader className="px-0 py-4">
                      <DrawerTitle>Введите описание</DrawerTitle>
                    </DrawerHeader>

                    <Textarea className="max-h-[250px]" autoFocus {...field} />
                  </DrawerContent>
                </Drawer>
              </FormControl>
            </FormItem>
          )}
        />
      </Card>
    </div>
  );
};
