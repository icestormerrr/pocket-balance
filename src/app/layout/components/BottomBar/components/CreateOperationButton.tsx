import {CirclePlus} from "lucide-react";
import {useState} from "react";

import {Button} from "@/shared/ui/button";
import TransactionFormDrawer from "@/widgets/TransactionFormDrawer";

export function CreateOperationButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size={"icon"} className={`w-11 h-11`} onClick={() => setOpen(true)}>
        <CirclePlus />
      </Button>

      <TransactionFormDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
