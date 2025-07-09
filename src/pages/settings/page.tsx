import {useOperationStore} from "@/entities/operation";
import {Button} from "@/shared/ui/button";
import {Link} from "@tanstack/react-router";

export default function SettingsPage() {
  const operations = useOperationStore(s => s.operations);
  const sendDataToServer = async () => {
    fetch("/api/operations", {method: "POST", body: JSON.stringify(operations)});
  };

  return (
    <div className={"p-4"}>
      <h1 className="text-xl font-semibold">Настройки</h1>
      <div className="flex flex-col gap-2">
        <Link to={"/categories"} className={"w-full mt-4"}>
          <Button variant="outline" className={"w-full"}>
            Категории
          </Button>
        </Link>
        <Button variant="outline" className={"w-full"} onClick={sendDataToServer}>
          Синхронизовать
        </Button>
      </div>
    </div>
  );
}
