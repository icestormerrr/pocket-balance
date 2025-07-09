import {useCategoryStore} from "@/entities/category";
import {useOperationStore} from "@/entities/operation";
import {ScrollArea} from "@/shared/ui/scroll-area";
import {useRef} from "react";
import OperationFormDrawer, {type OperationFormDrawerRef} from "@/widgets/operation-form-drawer";
import {OperationsStats} from "@/pages/operations/_ui/OperationsStats.tsx";
import OperationCard from "@/pages/operations/_ui/OperationCard.tsx";


export default function OperationsPage() {
  const operations = useOperationStore(s => s.operations);
  const categories = useCategoryStore(s => s.categories);

  const drawerRef = useRef<OperationFormDrawerRef>(null);
  const handleCategoryClick = (id: string) => {
    drawerRef.current?.openDrawer(id);
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Операции</h1>
      </div>

      <OperationsStats />

      <ScrollArea className="h-[calc(100vh-9rem)] pr-2">
        <div className="flex flex-col gap-3">
          {operations.map(operation => (
            <div onClick={() => handleCategoryClick(operation.id)} key={operation.id}>
              <OperationCard
                id={operation.id}
                amount={operation.amount}
                date={operation.date}
                comment={operation.comment}
                categoryName={categories[operation.categoryId]?.name ?? ""}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
      <OperationFormDrawer ref={drawerRef} />
    </div>
  );
}
