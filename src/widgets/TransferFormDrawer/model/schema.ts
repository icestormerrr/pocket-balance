import {z} from "zod";

export const transferFormSchema = z
  .object({
    transferId: z.string().optional(),
    amount: z.number({required_error: "Обязательное поле"}).min(0.01, "Сумма должна быть больше 0"),
    fromAccountId: z.string().min(1, "Выберите счёт списания"),
    toAccountId: z.string().min(1, "Выберите счёт зачисления"),
    date: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Некорректная дата",
    }),
  })
  .superRefine((values, ctx) => {
    if (values.fromAccountId === values.toAccountId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toAccountId"],
        message: "Счета должны различаться",
      });
    }
  });

export type TransferFormState = z.infer<typeof transferFormSchema>;

