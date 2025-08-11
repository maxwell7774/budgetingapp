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

import { useEffect, useRef, useState } from "react";
import { Button } from "./index.ts";

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  options?: Option[];
  value: string;
  onChange: (valvue: string) => void;
  placeholder?: string;
}

export function Select({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
}: Props) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={selectRef}
      className="relative inline-block w-56"
    >
      <Button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        variant="outline"
        onClick={() => setOpen(!open)}
        className="w-full"
      >
        {/* {value ? value : placeholder} */}
        {open ? "true" : "false"}
      </Button>
      <ul
        role="listbox"
        data-open={open}
        aria-hidden={!open}
        className="absolute origin-top mt-1 w-full bg-white opacity-100 scale-100 aria-hidden:opacity-0 aria-hidden:scale-95 transition-all pointer-events-none z-10 isolate"
      >
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
        <li>item 4</li>
      </ul>
    </div>
  );
}
