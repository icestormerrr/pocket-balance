import {Link} from "@tanstack/react-router";

import {exportLocalStorageData} from "@/pages/more/lib/sharing.tsx";
import {Button} from "@/shared/ui/button";
import {Import, List, Share} from "lucide-react";
import {useRef} from "react";

const MorePage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = reader.result;
        if (typeof result === "string") {
          const data = JSON.parse(result) as Record<string, unknown>;
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
          });
          alert("Импорт завершён успешно ✅");
        }
      } catch (error) {
        console.error("Ошибка при импорте:", error);
        alert("❌ Ошибка при импорте. Проверьте формат файла.");
      }
    };

    reader.readAsText(file);
  };
  return (
    <div className={"p-4"}>
      <h1 className="text-xl font-semibold">Настройки</h1>
      <div className="flex flex-col gap-2">
        <Link to={"/categories"} className={"w-full mt-4"}>
          <Button variant="outline" className={"w-full"}>
            Категории <List />
          </Button>
        </Link>
        <Button
          variant="outline"
          className={"w-full"}
          onClick={() => exportLocalStorageData(["categories", "transactions"])}
        >
          Экспортировать <Share />
        </Button>
        <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
          Импортировать <Import />
        </Button>

        {/* Скрытый input для импорта */}
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          style={{display: "none"}}
          onChange={handleImportFileChange}
        />
      </div>
    </div>
  );
};

export default MorePage;
