import {useFormContext} from "react-hook-form";

import {CATEGORY_TYPE_OPTIONS} from "@/entities/category";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/shared/ui/form";
import {Input} from "@/shared/ui/input";
import {SegmentInput} from "@/shared/ui/tabs";

import type {CategoryFormState} from "../../../model/schema";

export const CategoryFormFields = () => {
  const {control} = useFormContext<CategoryFormState>();

  return (
    <div className="flex flex-col gap-2">
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
        name="shortName"
        render={({field, fieldState}) => (
          <FormItem>
            <FormLabel>Аббревиатура/иконка</FormLabel>
            <FormControl>
              <Input placeholder="Аббревиатура/иконка категории" {...field} />
            </FormControl>
            <FormMessage>{fieldState.error?.message}</FormMessage>
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
              <SegmentInput
                className="bg-transparent"
                value={field.value}
                onChange={field.onChange}
                options={CATEGORY_TYPE_OPTIONS}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
