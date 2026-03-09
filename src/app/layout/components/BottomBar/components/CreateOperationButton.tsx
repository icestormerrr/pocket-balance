import {ArrowRightLeft, CirclePlus, ReceiptText} from "lucide-react";
import {type FC, useCallback, useState} from "react";

import {Button} from "@/shared/ui/button";
import {Card} from "@/shared/ui/card";
import {Cell} from "@/shared/ui/cell";
import {Drawer, DrawerContent, DrawerHeader, DrawerTitle} from "@/shared/ui/drawer";
import TransactionFormDrawer from "@/widgets/TransactionFormDrawer";
import TransferFormDrawer from "@/widgets/TransferFormDrawer";

export function CreateOperationButton() {
  const [openActionSheet, setOpenActionSheet] = useState(false);
  const [openTransactionForm, setOpenTransactionForm] = useState(false);
  const [openTransferForm, setOpenTransferForm] = useState(false);

  const openTransactionDrawer = useCallback(() => {
    setOpenActionSheet(false);
    setTimeout(() => setOpenTransactionForm(true), 150);
  }, []);

  const openTransferDrawer = useCallback(() => {
    setOpenActionSheet(false);
    setTimeout(() => setOpenTransferForm(true), 150);
  }, []);

  return (
    <>
      <Button variant="outline" size={"icon"} className="w-11 h-11" onClick={() => setOpenActionSheet(true)}>
        <CirclePlus />
      </Button>

      <CreateActionDrawer
        open={openActionSheet}
        onOpenChange={setOpenActionSheet}
        onOperationClick={openTransactionDrawer}
        onTransferClick={openTransferDrawer}
      />

      <TransactionFormDrawer open={openTransactionForm} onOpenChange={setOpenTransactionForm} />
      <TransferFormDrawer open={openTransferForm} onOpenChange={setOpenTransferForm} />
    </>
  );
}

type CreateActionDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOperationClick: () => void;
  onTransferClick: () => void;
};

const CreateActionDrawer: FC<CreateActionDrawerProps> = ({open, onOpenChange, onOperationClick, onTransferClick}) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
      <DrawerContent className="px-4 pb-6 min-h-[35vh]">
        <DrawerHeader className="px-0">
          <DrawerTitle>Что создать?</DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col gap-3">
          <Card className="p-4" onClick={onOperationClick}>
            <Cell>
              <Cell.Content>
                <Cell.Content.Title>Операция</Cell.Content.Title>
                <Cell.Content.Subtitle>Доход или расход по счёту</Cell.Content.Subtitle>
              </Cell.Content>
              <Cell.RightContent>
                <ReceiptText className="text-muted-foreground" />
              </Cell.RightContent>
            </Cell>
          </Card>

          <Card className="p-4" onClick={onTransferClick}>
            <Cell>
              <Cell.Content>
                <Cell.Content.Title>Перевод</Cell.Content.Title>
                <Cell.Content.Subtitle>Перемещение денег между своими счетами</Cell.Content.Subtitle>
              </Cell.Content>
              <Cell.RightContent>
                <ArrowRightLeft className="text-muted-foreground" />
              </Cell.RightContent>
            </Cell>
          </Card>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

