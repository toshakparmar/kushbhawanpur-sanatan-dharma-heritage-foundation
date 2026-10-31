"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown, Search, X } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: (SelectOption | string)[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  searchable = true,
  searchPlaceholder = "Search options...",
  clearable = false,
  disabled = false,
  className = "",
  id,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Normalize options
  const normalizedOptions: SelectOption[] = React.useMemo(() => {
    return options.map((opt) =>
      typeof opt === "string" ? { value: opt, label: opt } : opt,
    );
  }, [options]);

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return normalizedOptions;
    const q = search.toLowerCase();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.description && opt.description.toLowerCase().includes(q)),
    );
  }, [normalizedOptions, search]);

  React.useEffect(() => {
    if (open && searchable) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [open, searchable]);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={`flex h-10 w-full items-center justify-between rounded-xl border border-sand bg-paper px-3 py-2 text-xs text-ink transition-colors hover:border-gold/60 focus:border-gold focus:outline-hidden focus:ring-2 focus:ring-gold/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          aria-expanded={open}
        >
          <div className="flex items-center gap-2 truncate text-left">
            {selectedOption?.icon && (
              <span className="shrink-0 text-ink/70">{selectedOption.icon}</span>
            )}
            {selectedOption ? (
              <span className="font-medium text-ink truncate">
                {selectedOption.label}
              </span>
            ) : (
              <span className="text-ink/40 truncate">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 text-ink/40 ml-2">
            {clearable && selectedOption && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                className="hover:text-ink p-0.5 rounded transition-colors"
                title="Clear selection"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                open ? "rotate-180 text-gold-dark" : ""
              }`}
            />
          </div>
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className="z-50 w-(--radix-popover-trigger-width) min-w-[200px] max-w-[420px] rounded-xl border border-sand bg-paper p-1.5 shadow-xl transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          {searchable && (
            <div className="relative mb-1.5 border-b border-sand/60 pb-1.5 px-1">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-ink/40" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg bg-sand/30 py-1.5 pl-8 pr-3 text-xs text-ink placeholder:text-ink/40 focus:outline-hidden focus:ring-1 focus:ring-gold/50"
              />
            </div>
          )}

          <div className="max-h-56 overflow-y-auto space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-ink/50">
                No matching options found.
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt.value)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      isSelected
                        ? "bg-sand font-semibold text-maroon"
                        : "text-ink hover:bg-sand/50"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      {opt.icon && (
                        <span className="shrink-0 text-ink/70">{opt.icon}</span>
                      )}
                      <div className="truncate">
                        <div className="truncate">{opt.label}</div>
                        {opt.description && (
                          <div className="text-[10px] text-ink/60 font-normal truncate">
                            {opt.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-maroon ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
