import {Share} from "lucide-react";

import {Button} from "@/shared/ui/button";

import {exportLocalStorageData} from "../../lib/sharing";

export const ExportButton = () => {
  return (
    <Button
      variant="outline"
      className={"w-full"}
      onClick={() => exportLocalStorageData(["categories", "transactions"])}
    >
      Экспортировать <Share />
    </Button>
  );
};
