import {ArrowDownLeft, ArrowUpRight, CalendarDays, ChevronRight, CreditCard, MessageSquare} from "lucide-react";
import {useMemo, useState} from "react";
import {useFormContext} from "react-hook-form";

import {useAccounts} from "@/entities/account";
import {useCategories} from "@/entities/category";
import {DateConverter} from "@/shared/lib/datetime";
import {cn} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/button";
import {Card} from "@/shared/ui/card";
import {DatePickerMobile} from "@/shared/ui/date-picker";
import {DetailRow} from "@/shared/ui/detail-row";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer";
import {FormControl, FormField, FormItem, FormMessage} from "@/shared/ui/form";
import {Input} from "@/shared/ui/input";
import {SelectMobile} from "@/shared/ui/select";
import {Textarea} from "@/shared/ui/textarea";
import {ToggleGroup, ToggleGroupItem} from "@/shared/ui/toggle-group";
import {ValueEditorDrawer} from "@/shared/ui/value-editor-drawer";

import {getRecentCategoryIds} from "../../../utils/creationPreferences";
import type {TransactionFormState} from "../../../utils/schema";

export const TransactionFormFields = () => {
  const {clearErrors, control, formState, setValue, watch} = useFormContext<TransactionFormState>();
  const categoryType = watch("categoryType");
  const categoryId = watch("categoryId");
  const accountId = watch("accountId");
  const selectedDate = watch("date");
  const comment = watch("comment");
  const [isAccountPickerOpen, setAccountPickerOpen] = useState(false);
  const [temporaryQuickCategoryId, setTemporaryQuickCategoryId] = useState<string | null>(null);
  const {data: categories} = useCategories({type: categoryType});
  const {data: accounts} = useAccounts({});

  const categoriesOptions = useMemo(
    () => categories?.map(category => ({label: category.name, value: category.id})) ?? [],
    [categories]
  );
  const accountsOptions = useMemo(
    () => accounts?.map(account => ({label: account.name, value: account.id})) ?? [],
    [accounts]
  );
  const recentIds = getRecentCategoryIds(categoryType);
  const recentCategories = recentIds
    .map(id => categories?.find(category => category.id === id))
    .filter(category => category !== undefined);
  const baseQuickCategories = [
    ...recentCategories,
    ...(categories?.filter(category => !recentIds.includes(category.id)) ?? []),
  ].slice(0, 5);
  const temporaryQuickCategory =
    categoryId === temporaryQuickCategoryId
      ? categories?.find(category => category.id === temporaryQuickCategoryId)
      : undefined;
  const quickCategories = [
    ...(temporaryQuickCategory && !baseQuickCategories.some(category => category.id === temporaryQuickCategory.id)
      ? [temporaryQuickCategory]
      : []),
    ...baseQuickCategories,
  ].slice(0, 5);

  const selectedAccount = accountsOptions.find(option => option.value === accountId);
  const hasCategoryError = Boolean(formState.errors.categoryId);
  const hasDetailsError = Boolean(formState.errors.accountId || formState.errors.date || formState.errors.comment);
  const clearFieldError = (name: "amount" | "categoryId" | "accountId" | "date" | "comment") => clearErrors(name);

  return (
    <div className="flex flex-col gap-5">
      <FormField
        control={control}
        name="amount"
        render={({field, fieldState}) => (
          <FormItem data-invalid={Boolean(fieldState.error)} className="gap-3 py-3">
            <FormControl>
              <Input
                {...field}
                value={field.value ? String(field.value) : ""}
                onChange={event => {
                  clearFieldError("amount");
                  field.onChange(Number(event.target.value));
                }}
                type="number"
                min={0}
                inline
                placeholder="0"
                aria-invalid={Boolean(fieldState.error)}
                className="h-auto w-full text-center text-5xl font-bold aria-invalid:text-destructive"
              />
            </FormControl>
            <p className="text-center text-sm text-muted-foreground">Российский рубль</p>
            <FormMessage className="text-center" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="categoryType"
        render={({field}) => (
          <ToggleGroup
            type="single"
            value={categoryType}
            onValueChange={type => {
              if (!type) return;
              clearErrors("categoryId");
              setTemporaryQuickCategoryId(null);
              field.onChange(type);
              setValue("categoryId", "");
            }}
            className="w-full"
          >
            <ToggleGroupItem
              value="expense"
              className="h-12 flex-row gap-2 rounded-xl text-sm data-[state=on]:border-transparent data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
            >
              Расход <ArrowDownLeft data-icon="inline-end" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="income"
              className="h-12 flex-row gap-2 rounded-xl text-sm data-[state=on]:border-transparent data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
            >
              Доход <ArrowUpRight data-icon="inline-end" />
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      />

      <section data-invalid={hasCategoryError} className="flex flex-col gap-3" aria-labelledby="transaction-category">
        <div className="flex items-center justify-between px-1">
          <p id="transaction-category" className="text-sm font-medium">
            Категория
          </p>
          <span className="text-xs text-muted-foreground">Последние</span>
        </div>
        <FormField
          control={control}
          name="categoryId"
          render={({field}) => (
            <FormItem className="gap-2">
              <div className="grid grid-cols-3 gap-2">
                {quickCategories.map(category => (
                  <Button
                    key={category.id}
                    type="button"
                    variant={field.value === category.id ? "secondary" : "outline"}
                    onClick={() => {
                      clearFieldError("categoryId");
                      field.onChange(category.id);
                    }}
                    className="h-16 flex-col gap-1 rounded-xl px-2 text-xs"
                  >
                    <span className="text-base leading-none" aria-hidden>
                      {category.shortName}
                    </span>
                    <span className="w-full min-w-0 truncate text-center">{category.name}</span>
                  </Button>
                ))}
                <SelectMobile
                  value={field.value}
                  onChange={value => {
                    clearFieldError("categoryId");
                    field.onChange(value ?? "");
                    if (value && !baseQuickCategories.some(category => category.id === value)) {
                      setTemporaryQuickCategoryId(value);
                    }
                  }}
                  renderField={() => (
                    <Button type="button" variant="outline" className="h-16 flex-col gap-1 rounded-xl px-2 text-xs">
                      <ChevronRight />
                      Все категории
                    </Button>
                  )}
                  options={categoriesOptions}
                  title="Все категории"
                  placeholder="Выберите категорию"
                  hideSearch
                  renderOption={option => {
                    const category = categories?.find(item => item.id === option.value);

                    return (
                      <Button
                        variant={field.value === option.value ? "secondary" : "outline"}
                        className="h-14 w-full justify-start rounded-2xl px-4 text-left"
                      >
                        <span className="text-base leading-none" aria-hidden>
                          {category?.shortName}
                        </span>
                        <span className="truncate">{option.label}</span>
                      </Button>
                    );
                  }}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>

      <Card
        data-invalid={hasDetailsError}
        className={cn(
          "w-full gap-0 rounded-2xl border-border/70 bg-muted/30 p-2 shadow-none backdrop-blur-xl",
          hasDetailsError && "border-destructive"
        )}
      >
        <FormField
          control={control}
          name="accountId"
          render={({field}) => (
            <FormItem className="gap-1">
              <Drawer open={isAccountPickerOpen} onOpenChange={setAccountPickerOpen} repositionInputs={false}>
                <DrawerTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-between rounded-[1.1rem] px-3 py-3 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-muted" aria-hidden>
                        <CreditCard />
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">Счёт</span>
                        <span className="text-xs text-muted-foreground">
                          {selectedAccount?.label ?? "Выберите счёт"}
                        </span>
                      </span>
                    </span>
                    <ChevronRight className="text-muted-foreground" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="mx-auto max-h-[82vh] max-w-lg overflow-hidden">
                  <DrawerHeader className="px-5 pt-5 pb-3">
                    <DrawerTitle>Выберите счёт</DrawerTitle>
                  </DrawerHeader>
                  <div className="no-scrollbar max-h-[58vh] min-h-[250px] overflow-auto px-5 pb-5">
                    <div className="flex flex-col gap-2">
                      {accountsOptions.map(option => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={field.value === option.value ? "secondary" : "outline"}
                          onClick={() => {
                            clearFieldError("accountId");
                            field.onChange(option.value);
                            setAccountPickerOpen(false);
                          }}
                          className="h-14 justify-start rounded-2xl px-4 text-left"
                        >
                          <span className="truncate">{option.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
              <FormMessage className="px-3" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="date"
          render={({field}) => (
            <FormItem className="gap-1">
              <DatePickerMobile
                mode="single"
                value={field.value ? DateConverter.ISOToDate(field.value) : undefined}
                onChange={date => {
                  clearFieldError("date");
                  field.onChange(DateConverter.dateToISO(date));
                }}
              >
                <Button variant="ghost" className="h-auto w-full justify-between rounded-[1.1rem] px-3 py-3 text-left">
                  <span className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-muted" aria-hidden>
                      <CalendarDays />
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">Дата</span>
                      <span className="text-xs text-muted-foreground">
                        {selectedDate
                          ? DateConverter.ISOToFormattedString(selectedDate, "DD.MM.YYYY")
                          : "Выберите дату"}
                      </span>
                    </span>
                  </span>
                  <ChevronRight className="text-muted-foreground" />
                </Button>
              </DatePickerMobile>
              <FormMessage className="px-3" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="comment"
          render={({field, fieldState}) => (
            <FormItem className="gap-1">
              <ValueEditorDrawer
                title="Комментарий"
                trigger={
                  <DetailRow
                    icon={<MessageSquare />}
                    label="Комментарий"
                    value={comment || "Добавить заметку"}
                    className={cn(fieldState.error && "text-destructive")}
                  />
                }
              >
                <Textarea
                  className="min-h-40 resize-none rounded-2xl"
                  placeholder="Например, продукты на неделю"
                  autoFocus
                  {...field}
                  onChange={event => {
                    clearFieldError("comment");
                    field.onChange(event);
                  }}
                />
              </ValueEditorDrawer>
              <FormMessage className="px-3" />
            </FormItem>
          )}
        />
      </Card>
    </div>
  );
};
