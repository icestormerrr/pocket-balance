import {Button} from "@/shared/ui/button";
import {CirclePlus} from "lucide-react";
import {useRef} from "react";
import OperationFormDrawer, {type OperationFormDrawerRef} from "@/widgets/operation-form-drawer";

export function CreateOperationButton({className}: {className?: string}) {
  const ref = useRef<OperationFormDrawerRef>(null);
  return (
    <>
      <Button
        variant="outline"
        size={"icon"}
        className={`w-12 h-12 ${className}`}
        onClick={() => ref.current?.openDrawer()}
      >
        <CirclePlus />
      </Button>
      <OperationFormDrawer ref={ref} />
    </>
  );
}
