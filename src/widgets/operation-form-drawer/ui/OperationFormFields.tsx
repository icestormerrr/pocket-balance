import {CATEGORY_TYPE_OPTIONS} from "@/entities/category";
import {DatePicker} from "@/shared/ui/date-picker";
import {FormControl, FormField, FormItem, FormLabel} from "@/shared/ui/form";
import {Input, NumericInput} from "@/shared/ui/input";
import {SelectInput} from "@/shared/ui/select";
import {SegmentInput} from "@/shared/ui/tabs";
import type {OperationFormValues} from "@/widgets/operation-form-drawer/model/schema";
import {useCategoryOptions} from "@/widgets/operation-form-drawer/model/useCategoryOptions";
import {useFormContext} from "react-hook-form";

export function OperationFormFields() {
  const {control, watch, setValue} = useFormContext<OperationFormValues>();
  const categoryType = watch("categoryType");
  const categoriesOptions = useCategoryOptions(categoryType);

  return (
    <>
      <FormField
        control={control}
        name="categoryType"
        render={({field, fieldState}) => (
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
        render={({field, fieldState}) => (
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
        render={({field, fieldState}) => (
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
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={date => {
                  field.onChange(date?.toUTCString());
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
              <Input type="text" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
