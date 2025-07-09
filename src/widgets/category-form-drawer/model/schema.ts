import {z} from "zod";

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Введите название"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Неверный формат цвета"),
  type: z.enum(["income", "expense"], {required_error: "Выберите тип"}),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
