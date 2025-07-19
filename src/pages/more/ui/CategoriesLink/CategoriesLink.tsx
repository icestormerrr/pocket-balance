import {Link} from "@tanstack/react-router";
import {List} from "lucide-react";

import {Button} from "@/shared/ui/button";

export const CategoriesLink = () => {
  return (
    <Link to={"/categories"} className="w-full">
      <Button variant="outline" className="w-full">
        Категории <List />
      </Button>
    </Link>
  );
};
