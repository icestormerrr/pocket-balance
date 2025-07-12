import {Link} from "@tanstack/react-router";

import {Button} from "@/shared/ui/button";

const SettingsPage = () => {
  return (
    <div className={"p-4"}>
      <h1 className="text-xl font-semibold">Настройки</h1>
      <div className="flex flex-col gap-2">
        <Link to={"/categories"} className={"w-full mt-4"}>
          <Button variant="outline" className={"w-full"}>
            Категории
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SettingsPage;
