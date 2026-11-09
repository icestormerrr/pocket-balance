import {Palette, Tag, Type} from "lucide-react";
import {useFormContext} from "react-hook-form";

import {CATEGORY_TYPE_OPTIONS} from "@/ui/entities/category";
import {cn} from "@/ui/shared/lib/styling";
import {Card} from "@/ui/shared/ui/card";
import {DetailRow} from "@/ui/shared/ui/detail-row";
import {FormField, FormItem, FormMessage} from "@/ui/shared/ui/form";
import {Input} from "@/ui/shared/ui/input";
import {SelectMobile} from "@/ui/shared/ui/select";
import {ValueEditorDrawer} from "@/ui/shared/ui/value-editor-drawer";

import type {CategoryFormState} from "../../../model/schema";

export const CategoryFormFields = () => {
  const {control} = useFormContext<CategoryFormState>();

  return (
    <Card className="w-full gap-0 rounded-2xl border-border/70 bg-muted/30 p-2 shadow-none backdrop-blur-xl">
      <FormField
        control={control}
        name="name"
        render={({field, fieldState}) => (
          <FormItem className="gap-1">
            <ValueEditorDrawer
              title="Название категории"
              trigger={
                <DetailRow
                  icon={<Tag />}
                  label="Название"
                  value={field.value || "Введите название"}
                  className={cn(fieldState.error && "text-destructive")}
                />
              }
            >
              <Input {...field} size="lg" placeholder="Например, Продукты" className="rounded-2xl" />
              <FormMessage />
            </ValueEditorDrawer>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="shortName"
        render={({field, fieldState}) => (
          <FormItem className="gap-1">
            <ValueEditorDrawer
              title="Иконка или аббревиатура"
              trigger={
                <DetailRow
                  icon={<Type />}
                  label="Иконка или аббревиатура"
                  value={field.value || "Добавить"}
                  className={cn(fieldState.error && "text-destructive")}
                />
              }
            >
              <Input {...field} size="lg" placeholder="Например, 🛒" className="rounded-2xl" />
              <FormMessage />
            </ValueEditorDrawer>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="color"
        render={({field}) => (
          <FormItem className="gap-1">
            <label className="flex h-auto w-full cursor-pointer items-center justify-between rounded-[1.1rem] px-3 py-3 text-left hover:bg-accent">
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted" aria-hidden>
                  <Palette />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium">Цвет</span>
                  <span className="truncate text-xs text-muted-foreground">Выберите цвет категории</span>
                </span>
              </span>
              <Input
                {...field}
                type="color"
                aria-label="Цвет категории"
                className="size-10 shrink-0 cursor-pointer rounded-xl border-border/70 bg-transparent p-1"
              />
            </label>
            <FormMessage className="px-3" />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="type"
        render={({field}) => (
          <FormItem className="gap-1">
            <SelectMobile
              value={field.value}
              onChange={value => field.onChange(value ?? field.value)}
              options={CATEGORY_TYPE_OPTIONS}
              title="Выберите тип категории"
              placeholder="Выберите тип"
              renderField={() => (
                <DetailRow
                  icon={<Tag />}
                  label="Тип"
                  value={CATEGORY_TYPE_OPTIONS.find(option => option.value === field.value)?.label ?? "Выберите тип"}
                />
              )}
            />
            <FormMessage className="px-3" />
          </FormItem>
        )}
      />
    </Card>
  );
};
