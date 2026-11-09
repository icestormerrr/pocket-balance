import {Share} from "lucide-react";

import {Button} from "@/ui/shared/ui/button";

import {exportLocalStorageData} from "../../lib/sharing";

export const ExportButton = () => {
  return (
    <Button
      variant="outline"
      size="lg"
      className={"w-full"}
      onClick={() => exportLocalStorageData(["categories", "transactions", "accounts"])}
    >
      Экспортировать <Share />
    </Button>
  );
};
