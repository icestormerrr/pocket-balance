import {z} from "zod";

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Введите название"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Неверный формат цвета"),
  type: z.enum(["income", "expense"], {required_error: "Выберите тип"}),
  shortName: z
    .string()
    .min(1, "Введите аббревиатуру/иконку")
    .max(
      3,
      "Аббревиатура/иконка не может быть длиннее нескольких символов (некоторые смайлики считаются несколько символов)"
    ),
});

export type CategoryFormState = z.infer<typeof categorySchema>;
