import {type OperationFormValues, operationSchema} from "@/widgets/operation-form-drawer/model/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

export const useOperationForm = () => {
  return useForm<OperationFormValues>({
    resolver: zodResolver(operationSchema),
  });
};
