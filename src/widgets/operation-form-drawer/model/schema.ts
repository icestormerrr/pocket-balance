import {z} from "zod";

export const operationSchema = z.object({
  id: z.string().optional(),
  amount: z.number({required_error: "Введите сумму"}).min(0.01, "Сумма должна быть больше 0"),
  categoryId: z.string().min(1, "Выберите категорию"),
  categoryType: z.enum(["expense", "income"]),
  accountId: z.string().optional(),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Некорректная дата",
  }),
  comment: z.string().max(200, "Комментарий слишком длинный").optional(),
});

export type OperationFormValues = z.infer<typeof operationSchema>;
