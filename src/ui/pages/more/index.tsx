import {CategoriesLink} from "./ui/CategoriesLink/CategoriesLink";
import {ExportButton} from "./ui/ExportButton/ExportButton";
import {ImportButton} from "./ui/ImportButton/ImportButton";
import {ThemeToggle} from "./ui/ThemeToggle/ThemeToggle";

const MorePage = () => {
  return (
    <div className="p-4">
      <h1 className="flex justify-between items-center text-2xl font-bold">Ещё</h1>

      <div className="flex flex-col gap-2 mt-4">
        <ThemeToggle />
        <CategoriesLink />
        <ExportButton />
        <ImportButton />
      </div>
    </div>
  );
};

export default MorePage;
