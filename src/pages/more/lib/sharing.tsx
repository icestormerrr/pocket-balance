export function exportLocalStorageData(keys: string[]) {
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

  // Попробуем Web Share API (на телефонах)
  if (navigator.share) {
    const blob = new Blob([json], {type: "application/json"});
    const file = new File([blob], "localStorageExport.json", {type: "application/json"});

    navigator
      .share({
        title: "Exported Data",
        text: "Here is my localStorage data",
        files: [file],
      })
      .catch(err => console.warn("Share cancelled or failed:", err));
  } else {
    // Фоллбек — скачать файл
    const blob = new Blob([json], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "localStorageExport.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
