import {useFormContext} from "react-hook-form";

import {CATEGORY_TYPE_OPTIONS} from "@/entities/category";
import {FormControl, FormField, FormItem, FormLabel} from "@/shared/ui/form.tsx";
import {Input} from "@/shared/ui/input.tsx";
import {SegmentInput} from "@/shared/ui/tabs.tsx";

import type {CategoryFormState} from "../../../model/schema.ts";

export const CategoryFormFields = () => {
  const {control} = useFormContext<CategoryFormState>();

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({field}) => (
          <FormItem>
            <FormLabel>Название</FormLabel>
            <FormControl>
              <Input placeholder="Название категории" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="color"
        render={({field}) => (
          <FormItem>
            <FormLabel>Цвет</FormLabel>
            <FormControl>
              <Input type="color" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="type"
        render={({field}) => (
          <FormItem>
            <FormLabel>Тип категории</FormLabel>
            <FormControl>
              <SegmentInput value={field.value} onChange={field.onChange} options={CATEGORY_TYPE_OPTIONS} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
