import SunIcon from "./ui/icons/Sun.tsx";
import Button from "./ui/Button.tsx";
import MoonIcon from "./ui/icons/Moon.tsx";
import { useState } from "react";

function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  const changeTheme = function () {
    if (theme == "light") {
      localStorage.setItem("theme", "dark");
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("theme", "light");
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <nav className="p-8">
      <div className="max-w-7xl mx-auto flex items-center">
        <div>
          <a
            className="text-2xl font-bold flex items-center bg-white dark:bg-slate-800 py-4 px-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            href="/"
          >
            <img className="w-10 me-4" src="/fish.svg" />
            Guppy Goals
          </a>
        </div>
        <ul className="ms-auto flex h-full items-center font-semibold p-2 bg-white dark:bg-slate-800 rounded-full">
          <li>
            <a
              href="/"
              className="flex items-center justify-center rounded-full h-11 px-5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/about"
              className="flex items-center justify-center rounded-full h-11 px-5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="/login"
              className="flex items-center justify-center rounded-full h-11 px-5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              Login
            </a>
          </li>
          <li>
            <Button variant="ghost" onClick={changeTheme}>
              {theme == "dark"
                ? <MoonIcon className="size-6" />
                : <SunIcon className="size-6" />}
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
