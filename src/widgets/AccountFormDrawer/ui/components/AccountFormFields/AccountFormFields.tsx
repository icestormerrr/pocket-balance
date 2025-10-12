import {ChevronRight} from "lucide-react";
import {useFormContext} from "react-hook-form";

import {CURRENCY_OPTIONS} from "@/entities/account";
import {Button} from "@/shared/ui/button";
import {Card} from "@/shared/ui/card";
import {Cell} from "@/shared/ui/cell";
import {Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/shared/ui/drawer";
import {FormField, FormMessage} from "@/shared/ui/form";
import {Input} from "@/shared/ui/input";
import {SelectMobile} from "@/shared/ui/select";

import type {AccountFormState} from "../../../model/schema";

export const AccountFormFields = () => {
  const {control} = useFormContext<AccountFormState>();

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

                <Input {...field} maxLength={50} />
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
          name="startAmount"
          render={({field, fieldState}) => (
            <Drawer repositionInputs={false}>
              <DrawerTrigger asChild>
                <div>
                  <Cell>
                    <Cell.Content>
                      <Cell.Content.Title>
                        <span className={fieldState.error?.message ? "text-[var(--negative-accent)]" : ""}>
                          Начальный остаток
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
                  <DrawerTitle>Введите начальный остаток</DrawerTitle>
                </DrawerHeader>

                <Input
                  {...field}
                  value={String(field.value)}
                  onChange={e => field.onChange(Number(e.target.value))}
                  type="number"
                  min={0}
                />
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
          name="currencyCode"
          render={({field}) => (
            <SelectMobile
              {...field}
              renderField={() => (
                <div>
                  <Cell>
                    <Cell.Content>
                      <Cell.Content.Title>Валюта</Cell.Content.Title>
                      {field.value && (
                        <Cell.Content.Subtitle>
                          {CURRENCY_OPTIONS.find(opt => opt.value === field.value)?.label}
                        </Cell.Content.Subtitle>
                      )}
                    </Cell.Content>
                    <Cell.RightContent>
                      <ChevronRight />
                    </Cell.RightContent>
                  </Cell>
                </div>
              )}
              options={CURRENCY_OPTIONS}
              title="Выберите валюту"
              placeholder="Выберите валюту"
            />
          )}
        />
      </Card>
    </div>
  );
};
