import {X} from "lucide-react";
import {Surface} from "./surface";

import classNames from "./drawer-close-button.module.css";

export function DrawerCloseButton({onClick}: {onClick: () => void}) {
  return (
    <Surface variant="glass" asChild>
      <button type="button" className={classNames.closeButton} onClick={onClick} aria-label="Закрыть">
        <X aria-hidden="true" strokeWidth={1.5} />
      </button>
    </Surface>
  );
}
