import {Link} from "@tanstack/react-router";

import {ExportButton} from "@/pages/more/ui/ExportButton/ExportButton";
import {ImportButton} from "@/pages/more/ui/ImportButton/ImportButton";
import {Button} from "@/shared/ui/button";
import {List} from "lucide-react";

const MorePage = () => {
  return (
    <div className={"p-4"}>
      <h1 className="flex justify-between items-center text-2xl font-bold">Ещё</h1>

      <div className="flex flex-col gap-2">
        <Link to={"/categories"} className={"w-full mt-4"}>
          <Button variant="outline" className={"w-full"}>
            Категории <List />
          </Button>
        </Link>
        <ExportButton />
        <ImportButton />
      </div>
    </div>
  );
};

export default MorePage;
