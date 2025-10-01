import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusBarHeight = () => {
  return 50;
};

export const BOTTOM_BAR_HEIGHT = 90;

export const getMainContentHeight = () => {
  return window.innerHeight - getStatusBarHeight() - BOTTOM_BAR_HEIGHT;
};
