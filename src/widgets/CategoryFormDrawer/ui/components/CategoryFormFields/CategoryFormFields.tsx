import {useFormContext} from "react-hook-form";

import {CATEGORY_TYPE_OPTIONS} from "@/entities/category";
import {FormField, FormMessage} from "@/shared/ui/form";
import {Input} from "@/shared/ui/input";
import {SegmentInput} from "@/shared/ui/tabs";

import {Button} from "@/shared/ui/button";
import {Card} from "@/shared/ui/card";
import {Cell} from "@/shared/ui/cell";
import {Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/shared/ui/drawer";
import {ChevronRight} from "lucide-react";
import type {CategoryFormState} from "../../../model/schema";

export const CategoryFormFields = () => {
  const {control} = useFormContext<CategoryFormState>();

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-4">
        <FormField
          control={control}
          name="name"
          render={({field, fieldState}) => (
            <Drawer repositionInputs={false}>
              <DrawerTrigger asChild>
                <div>
                  <Cell>
                    <Cell.Content>
                      <Cell.Content.Title>
                        <span className={fieldState.error?.message ? "text-[var(--negative-accent)]" : ""}>
                          Название
                        </span>
                      </Cell.Content.Title>
                      {field.value && <Cell.Content.Subtitle>{field.value}</Cell.Content.Subtitle>}
                    </Cell.Content>
                    <Cell.RightContent>
                      <ChevronRight />
                    </Cell.RightContent>
                  </Cell>
                </div>
              </DrawerTrigger>

              <DrawerContent className="px-4 pb-4 min-h-[80vh]">
                <DrawerHeader className="px-0 py-4">
                  <DrawerTitle>Введите название</DrawerTitle>
                </DrawerHeader>

                <Input {...field} />
                <FormMessage>{fieldState.error?.message}</FormMessage>

                <DrawerClose className="flex justify-end">
                  <Button className="mt-4 w-25">Готово</Button>
                </DrawerClose>
              </DrawerContent>
            </Drawer>
          )}
        />
      </Card>

      <Card className="p-4">
        <FormField
          control={control}
          name="shortName"
          render={({field, fieldState}) => (
            <Drawer repositionInputs={false}>
              <DrawerTrigger asChild>
                <div>
                  <Cell>
                    <Cell.Content>
                      <Cell.Content.Title>
                        <span className={fieldState.error?.message ? "text-[var(--negative-accent)]" : ""}>
                          Аббревиатура/иконка
                        </span>
                      </Cell.Content.Title>
                      {field.value && <Cell.Content.Subtitle>{field.value}</Cell.Content.Subtitle>}
                    </Cell.Content>
                    <Cell.RightContent>
                      <ChevronRight />
                    </Cell.RightContent>
                  </Cell>
                </div>
              </DrawerTrigger>

              <DrawerContent className="px-4 pb-4 min-h-[80vh]">
                <DrawerHeader className="px-0 py-4">
                  <DrawerTitle>Введите аббревиатуру/иконку</DrawerTitle>
                </DrawerHeader>

                <Input {...field} />
                <FormMessage>{fieldState.error?.message}</FormMessage>

                <DrawerClose className="flex justify-end">
                  <Button className="mt-4 w-25">Готово</Button>
                </DrawerClose>
              </DrawerContent>
            </Drawer>
          )}
        />
        <FormField
          control={control}
          name="color"
          render={({field}) => (
            <Cell>
              <Cell.Content>
                <Cell.Content.Title>Цвет</Cell.Content.Title>
              </Cell.Content>
              <Cell.RightContent>
                <Input className="w-31" type="color" {...field} />
              </Cell.RightContent>
            </Cell>
          )}
        />

        <FormField
          control={control}
          name="type"
          render={({field}) => (
            <Cell>
              <Cell.Content>
                <Cell.Content.Title>Тип</Cell.Content.Title>
              </Cell.Content>
              <Cell.RightContent>
                <SegmentInput
                  className="bg-transparent"
                  value={field.value}
                  onChange={field.onChange}
                  options={CATEGORY_TYPE_OPTIONS}
                />
              </Cell.RightContent>
            </Cell>
          )}
        />
      </Card>
    </div>
  );
};
