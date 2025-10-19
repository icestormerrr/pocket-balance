import React from "react";

type GradientPosition =
  | "top"
  | "top-left"
  | "top-right"
  | "center"
  | "middle"
  | "bottom"
  | "bottom-left"
  | "bottom-right";

interface GradientBlobProps {
  /** Начальный цвет градиента */
  colorFrom: string;
  /** Конечный цвет градиента */
  colorTo: string;
  /** Размер блоба (по умолчанию 400px) */
  size?: number;
  /** Позиция блоба (top, top-left, center, bottom-right и т.д.) */
  position?: GradientPosition;
  /** Прозрачность (по умолчанию 0.6) */
  opacity?: number;
  /** Blur-эффект (по умолчанию 120px) */
  blur?: number;
  /** z-index блоба (по умолчанию 0) */
  zIndex?: number;
}

export const GradientBlob: React.FC<GradientBlobProps> = ({
  colorFrom,
  colorTo,
  size = 400,
  position = "center",
  opacity = 0.6,
  blur = 120,
  zIndex = 0,
}) => {
  // Определяем позицию блоба
  const getPositionStyles = (pos: GradientPosition): React.CSSProperties => {
    const half = `calc(50% - ${size / 2}px)`;
    switch (pos) {
      case "top":
        return {top: 0, left: half};
      case "top-left":
        return {top: 0, left: 0};
      case "top-right":
        return {top: 0, right: 0};
      case "center":
      case "middle":
        return {top: half, left: half};
      case "bottom":
        return {bottom: 0, left: half};
      case "bottom-left":
        return {bottom: 0, left: 0};
      case "bottom-right":
        return {bottom: 0, right: 0};
      default:
        return {top: half, left: half};
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        background: `radial-gradient(circle at center, ${colorFrom}, ${colorTo})`,
        filter: `blur(${blur}px)`,
        opacity,
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex,
        ...getPositionStyles(position),
      }}
    />
  );
};
