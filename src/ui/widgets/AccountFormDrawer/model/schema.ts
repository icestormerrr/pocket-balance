import {z} from "zod";

export const accountFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Название не заполнено").max(50, "Название слишком длинное"),
  currencyCode: z.string().min(1, "Валюта не выбрана"),
  startAmount: z.number({required_error: "Введите начальную сумму"}).min(0.01, "Сумма должна быть больше 0"),
});

export type AccountFormState = z.infer<typeof accountFormSchema>;
