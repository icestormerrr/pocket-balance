import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";
import {toast} from "sonner";

// TODO: отрефакторить
export async function exportLocalStorageData(keys: string[]) {
  const data: Record<string, unknown> = {};

  keys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      try {
        data[key] = JSON.parse(value);
      } catch {
        data[key] = value;
      }
    }
  });

  const json = JSON.stringify(data, null, 2);

  if (navigator.share && window.File && window.FileReader && window.Blob) {
    // Web Share API с файлом
    const blob = new Blob([json], {type: "application/json"});
    const file = new File([blob], "localStorageExport.json", {type: "application/json"});

    try {
      await navigator.share({
        title: "Exported Data",
        text: "Here is my localStorage data",
        files: [file],
      });
      toast("Данные успешно экспортированы и готовы к отправке");
    } catch (err) {
      toast.error("Отмена или ошибка при шаринге");
      console.warn("Share cancelled or failed:", err);
    }
  } else {
    // Фоллбек: сохраняем в файл на диск через Capacitor Filesystem
    try {
      const res = await Filesystem.writeFile({
        path: `pocket-balance-export.json`,
        data: json,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      toast(`Данные успешно экспортированы в ${res.uri}`);

      // Для Android и iOS можно добавить уведомление или инструкцию как найти файл
    } catch (err) {
      toast.error("Ошибка при сохранении файла");
      console.error("Filesystem write error:", err);
    }
  }
}
