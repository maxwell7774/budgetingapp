/*
import { ReactNode, useEffect, useState } from "react";
import { Button } from "./index.ts";
import { ChevronDownIcon } from "./icons/chevron-down.tsx";

export function Select() {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string | number | undefined>(undefined);

  useEffect(() => {
    setOpen(false);
  }, [value]);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className="pe-10"
        onClick={() => setOpen(!open)}
      >
        {value ? value.toString() : "Category"}
      </Button>
      <div className="absolute top-0 bottom-0 right-4 grid place-content-center select-none pointer-events-none">
        <ChevronDownIcon
          data-open={open}
          className="size-5 text-slate-500 data-[open=true]:rotate-180 transition-transform"
        />
      </div>
      <ul
        data-open={open}
        className="absolute top-full bg-slate-200 rounded-3xl p-3 hidden data-[open=true]:block min-w-full"
      >
        <SelectItem value="item 1" setValue={setValue}>item 1</SelectItem>
        <SelectItem value="item 2" setValue={setValue}>item 2</SelectItem>
        <SelectItem value="item 3" setValue={setValue}>item 3</SelectItem>
        <SelectItem value="item 4" setValue={setValue}>item 4</SelectItem>
        <SelectItem value="item 5" setValue={setValue}>item 5</SelectItem>
      </ul>
    </div>
  );
}

interface SelectItemProps {
  children: ReactNode;
  value: string | number;
  setValue: (newValue: string | number | undefined) => void;
}

function SelectItem({ children, setValue, value }: SelectItemProps) {
  return (
    <li
      onClick={() => {
        setValue(value);
        console.log("Selected Value!");
      }}
      className="px-2 py-1 hover:bg-slate-100 transition-colors rounded-3xl hover:cursor-pointer select-none"
    >
      {children}
    </li>
  );
}
*/

import {
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "./index.ts";
import { ChevronDownIcon } from "./icons/chevron-down.tsx";

export function Select() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | number>();
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const items = ["item 1", "item 2", "item 3", "item 4", "item 5"];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        listRef.current &&
        !listRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus the highlighted item when opening
  useEffect(() => {
    if (open && listRef.current) {
      const item = listRef.current.querySelectorAll<HTMLLIElement>(
        "[role='option']",
      )[highlightedIndex];
      item?.focus();
    }
  }, [open, highlightedIndex]);

  const selectItem = useCallback(
    (index: number) => {
      setValue(items[index]);
      setOpen(false);
      buttonRef.current?.focus();
    },
    [items],
  );

  const onButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setHighlightedIndex(0);
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectItem(highlightedIndex);
    } else if (e.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div className="relative inline-block">
      <Button
        type="button"
        variant="outline"
        className="pe-10"
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onButtonKeyDown}
      >
        {value ?? "Category"}
      </Button>

      <div className="absolute top-0 bottom-0 right-4 grid place-content-center select-none pointer-events-none">
        <ChevronDownIcon
          data-open={open}
          className="size-5 text-slate-500 data-[open=true]:rotate-180 transition-transform"
        />
      </div>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-activedescendant={`option-${highlightedIndex}`}
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          className="absolute top-full mt-1 bg-slate-200 rounded-3xl p-3 min-w-full shadow-lg focus:outline-none"
        >
          {items.map((item, i) => (
            <SelectItem
              key={item}
              id={`option-${i}`}
              value={item}
              selected={value === item}
              highlighted={highlightedIndex === i}
              onSelect={() => selectItem(i)}
            >
              {item}
            </SelectItem>
          ))}
        </ul>
      )}
    </div>
  );
}

interface SelectItemProps {
  id: string;
  children: ReactNode;
  value: string | number;
  selected: boolean;
  highlighted: boolean;
  onSelect: () => void;
}

function SelectItem({
  id,
  children,
  selected,
  highlighted,
  onSelect,
}: SelectItemProps) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={selected}
      tabIndex={-1}
      onClick={onSelect}
      className={`px-2 py-1 rounded-3xl select-none cursor-pointer transition-colors ${
        highlighted ? "bg-slate-300" : "hover:bg-slate-100"
      }`}
    >
      {children}
    </li>
  );
}

