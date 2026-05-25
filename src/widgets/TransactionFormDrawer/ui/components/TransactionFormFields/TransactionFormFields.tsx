import {ChevronRight} from "lucide-react";
import {useMemo} from "react";
import {useFormContext} from "react-hook-form";

import {useAccounts} from "@/entities/account";
import {CATEGORY_TYPE_OPTIONS, useCategories} from "@/entities/category";
import {DateConverter} from "@/shared/lib/datetime";
import {Button} from "@/shared/ui/button";
import {Card} from "@/shared/ui/card";
import {Cell} from "@/shared/ui/cell";
import {DatePickerMobile} from "@/shared/ui/date-picker";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer";
import {FormControl, FormField, FormItem} from "@/shared/ui/form";
import {Input} from "@/shared/ui/input";
import {SelectMobile} from "@/shared/ui/select";
import {SegmentInput} from "@/shared/ui/tabs";
import {Textarea} from "@/shared/ui/textarea";

import type {TransactionFormState} from "../../../model/schema";

export const TransactionFormFields = () => {
  const {control, watch, setValue} = useFormContext<TransactionFormState>();
  const categoryType = watch("categoryType");

  const {data: categories} = useCategories({type: categoryType});
  const categoriesOptions = useMemo(
    () =>
      categories?.map(c => ({label: `${c.shortName ? c.shortName + " - " : ""}${c.name}`, value: c.id, payload: c})) ??
      [],
    [categories]
  );

  const {data: accounts} = useAccounts({});
  const accountsOptions = useMemo(
    () => accounts?.map(acc => ({label: acc.name, value: acc.id, payload: acc})) ?? [],
    [accounts]
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
                className={`h-auto w-full text-5xl font-bold text-center ${categoryType === "expense" ? "text-[var(--negative-accent)]" : "text-[var(--positive-accent)]"}`}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <Card className="w-full rounded-xl p-4">
        <FormField
          control={control}
          name="categoryType"
          render={({field}) => (
            <Cell>
              <Cell.Content>
                <Cell.Content.Title>Тип</Cell.Content.Title>
              </Cell.Content>
              <Cell.RightContent>
                <SegmentInput
                  value={categoryType}
                  onChange={type => {
                    field.onChange(type);
                    setValue("categoryId", "");
                  }}
                  options={CATEGORY_TYPE_OPTIONS}
                />
              </Cell.RightContent>
            </Cell>
          )}
        />
        <FormField
          control={control}
          name="categoryId"
          render={({field}) => (
            <SelectMobile
              {...field}
              renderField={() => (
                <div>
                  <Cell>
                    <Cell.Content>
                      <Cell.Content.Title>Категория</Cell.Content.Title>
                      {field.value && (
                        <Cell.Content.Subtitle>
                          {categoriesOptions.find(opt => opt.value === field.value)?.label}
                        </Cell.Content.Subtitle>
                      )}
                    </Cell.Content>
                    <Cell.RightContent>
                      <ChevronRight />
                    </Cell.RightContent>
                  </Cell>
                </div>
              )}
              options={categoriesOptions}
              title="Выберите категорию"
              placeholder="Выберите категорию"
            />
          )}
        />
      </Card>
      <Card className="w-full rounded-xl p-4">
        <FormField
          control={control}
          name="accountId"
          render={({field}) => (
            <SelectMobile
              {...field}
              renderField={() => (
                <div>
                  <Cell>
                    <Cell.Content>
                      <Cell.Content.Title>Счёт</Cell.Content.Title>
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
              title="Выберите счёт"
              placeholder="Выберите счёт"
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

        <FormField
          control={control}
          name="comment"
          render={({field}) => (
            <Drawer repositionInputs={false}>
              <DrawerTrigger asChild>
                <div>
                  <Cell>
                    <Cell.Content>
                      <Cell.Content.Title>Комментарий</Cell.Content.Title>
                      {field.value && <Cell.Content.Subtitle>{field.value}</Cell.Content.Subtitle>}
                    </Cell.Content>
                    <Cell.RightContent>
                      <ChevronRight />
                    </Cell.RightContent>
                  </Cell>
                </div>
              </DrawerTrigger>

              <DrawerContent className="mx-auto min-h-[72vh] max-w-lg">
                <DrawerHeader className="px-5 pb-3 pt-5">
                  <DrawerTitle>Комментарий к операции</DrawerTitle>
                  <p className="text-muted-foreground text-sm">
                    Короткая заметка поможет быстрее найти операцию позже.
                  </p>
                </DrawerHeader>

                <div className="px-5 pb-4">
                  <Card className="rounded-[1.5rem] border-border/70 bg-muted/20 p-3 shadow-none">
                    <Textarea
                      className="min-h-[220px] max-h-[320px] resize-none rounded-[1.25rem] border-0 bg-transparent px-2 py-2 text-sm shadow-none focus-visible:ring-0"
                      placeholder="Например: ужин с друзьями, зарплата за май или покупка билетов"
                      autoFocus
                      {...field}
                    />
                  </Card>
                </div>

                <DrawerFooter detached>
                  <DrawerClose asChild>
                    <Button size="lg" className="h-12 w-full rounded-2xl">
                      Готово
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
        />
      </Card>
    </div>
  );
};
