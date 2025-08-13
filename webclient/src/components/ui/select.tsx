import { useEffect, useRef, useState } from "react";
import { Button } from "./index.ts";

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  options?: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
}

export function Select({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [render, setRender] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const selectRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open && render) {
      setHighlightedIndex(-1);
      const timer = setTimeout(() => setRender(false), 150);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleOpen = function () {
    setRender(true);
    requestAnimationFrame(() => setOpen(true));
  };

  const handleSelectOption = function (newValue: string | number) {
    if (newValue !== value) {
      onChange(newValue);
    }
    setOpen(false);
  };

  const handleKeyDown = function (e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      handleOpen();
      setHighlightedIndex((prev) => ++prev % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      handleOpen();
      setHighlightedIndex((prev) => (--prev + options.length) % options.length);
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectOption(options[highlightedIndex].value);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const newSearch = searchTerm + e.key.toLowerCase();
      setSearchTerm(newSearch);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => setSearchTerm(""), 500);

      const matchIndex = options.findIndex((opt) =>
        opt.label.toLowerCase().startsWith(newSearch)
      );
      if (matchIndex >= 0) {
        setHighlightedIndex(matchIndex);
        handleOpen();
      }
    }
  };

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div
      ref={selectRef}
      className="relative inline-block w-56 focus-visible:outline-2 outline-offset-2 outline-indigo-500"
      onKeyDown={handleKeyDown}
    >
      <Button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        variant="outline"
        onClick={() => {
          if (!render) {
            handleOpen();
          } else {
            setOpen(false);
          }
        }}
        className="w-full focus-visible:outline-0"
      >
        {selectedOption ? selectedOption.label : placeholder}
      </Button>
      {render &&
        (
          <ul
            role="listbox"
            data-open={open}
            className="absolute origin-top mt-1 w-full bg-white dark:bg-slate-800
                        data-[open=true]:opacity-100 data-[open=true]:scale-100 opacity-0
                        scale-95 transition-all z-10 isolate p-1 rounded-3xl shadow-md"
            aria-activedescendant={highlightedIndex >= 0
              ? `option-${options[highlightedIndex].value}`
              : undefined}
          >
            {options.map((o, i) => {
              return (
                <li
                  key={`option-${o.value}`}
                  aria-selected={value === o.value}
                  data-highlighted={i === highlightedIndex}
                  className="p-2 px-4 data-[highlighted=true]:bg-slate-100 select-none
                                    data-[highlighted=true]:dark:bg-slate-700
                                    aria-selected:bg-slate-200 aria-selected:dark:bg-slate-600
                                    hover:cursor-pointer rounded-full transition-colors"
                  onMouseEnter={() => setHighlightedIndex(i)}
                  onClick={() => handleSelectOption(o.value)}
                >
                  {o.label}
                </li>
              );
            })}
          </ul>
        )}
    </div>
  );
}
