import {Import} from "lucide-react";
import React, {useRef} from "react";

import {Button} from "@/shared/ui/button";

export const ImportButton = () => {
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
    <>
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
    </>
  );
};
