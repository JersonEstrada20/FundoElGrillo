import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Select replacement that uses a vaul bottom drawer.
 * Accepts options as strings or { value, label } objects.
 */
export default function MobileSelect({ value, onChange, options, placeholder = "Selecciona...", className }) {
  const [open, setOpen] = useState(false);

  const normalized = options.map((o) => {
    const isObj = typeof o === "object" && o !== null;
    return { value: isObj ? o.value : o, label: isObj ? (o.label ?? o.value) : o };
  });

  const selected = normalized.find((o) => o.value === value);
  const displayLabel = selected ? selected.label : value || placeholder;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "bg-background border border-border px-3 py-2.5 text-sm text-left flex items-center justify-between gap-2 focus:border-accent focus:outline-none transition-colors select-none",
          className
        )}
      >
        <span className={cn("truncate", !value && "text-foreground/40")}>{displayLabel}</span>
        <ChevronDown className="w-4 h-4 text-foreground/40 flex-shrink-0" />
      </button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[70vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle>{placeholder}</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-2 pb-6 select-none">
            {normalized.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3.5 text-sm text-left transition-colors",
                    active ? "text-accent font-medium" : "text-foreground/80 hover:bg-muted"
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {active && <Check className="w-4 h-4 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}