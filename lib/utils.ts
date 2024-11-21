/** @format */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}

export function formatJSON(json: string, indent = 2): string {
  try {
    return JSON.stringify(JSON.parse(json), null, indent);
  } catch (e) {
    throw new Error("Invalid JSON");
  }
}
