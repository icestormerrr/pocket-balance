import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {type CategoryFormValues, categorySchema} from "./schema";

export const useCategoryForm = () => {
  return useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
  });
};
