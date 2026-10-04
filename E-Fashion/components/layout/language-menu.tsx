"use client";

import { useState } from "react";
import { Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Language } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Language selector.
 *
 * The previous version rendered two inert menu items with no `onClick`, so
 * choosing a language did nothing. This is a real single-select: Base UI's
 * radio group owns the checked state and closes the menu on selection.
 *
 * The available languages arrive as props from the server. An empty list would
 * leave `languages[0]` undefined, so the trigger is hidden entirely rather than
 * rendering an unlabelled globe.
 */
export function LanguageMenu({
  languages,
  className,
}: {
  languages: Language[];
  className?: string;
}) {
  const [value, setValue] = useState<string>(languages[0]?.code ?? "");
  const current = languages.find((language) => language.code === value) ?? languages[0];

  if (!current) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={`Language: ${current.label}`}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-muted",
              className,
            )}
          >
            <Globe className="size-4" aria-hidden="true" />
            <span>{current.label}</span>
          </button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => next && setValue(next)}>
          {languages.map((language) => (
            <DropdownMenuRadioItem key={language.code} value={language.code}>
              {language.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
