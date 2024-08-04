import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export const BUTTON_CLASS =
  "px-2 py-1 border-gray-500 border-2 rounded bg-white dark:bg-black hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class={BUTTON_CLASS}
    />
  );
}
