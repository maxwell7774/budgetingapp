import { useState } from "react";
import { Link, NavLink, To } from "react-router";
import { useAuth } from "./auth-provider.tsx";
import { Button } from "./ui/index.ts";
import { EllipsisIcon, MoonIcon, SunIcon } from "./ui/icons/index.ts";

function Navbar() {
  const { isAuthenticated } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  const changeTheme = function () {
    if (theme == "dark") {
      localStorage.setItem("theme", "light");
      setTheme("light");
      document.documentElement.classList.remove("dark");
    } else {
      localStorage.setItem("theme", "dark");
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <header className="sticky top-4 md:top-8 left-0 right-0 z-100 isolate">
      <nav>
        <div className="max-w-7xl min-w-max mx-auto flex items-center h-16 bg-slate-100 dark:bg-slate-800 md:bg-transparent md:dark:bg-transparent rounded-full">
          <div className="p-2 h-full bg-slate-100 dark:bg-slate-800 rounded-full">
            <Link
              className="h-full px-4 sm:px-8 text-xl font-bold flex items-center min-w-max rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              to="/"
            >
              <img className="w-8 me-4" src="/fish.svg" />
              Guppy Goals
            </Link>
          </div>
          <div className="ms-auto h-full p-2">
            <Button
              variant="ghost"
              className="h-full hover:bg-slate-200 dark:hover:bg-slate-700 md:hidden hover:opacity-100 active:opacity-100"
            >
              <EllipsisIcon className="size-6 min-w-6 min-h-6" />
            </Button>
          </div>
          <ul className="ms-auto h-full hidden md:flex items-center font-semibold p-2 gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-full">
            <NavItem to="/">
              Home
            </NavItem>
            <NavItem to="/about">
              About
            </NavItem>
            {isAuthenticated
              ? (
                <>
                  <NavItem to="/budgets">
                    Budgets
                  </NavItem>
                  <NavItem to="/profile">
                    Profile
                  </NavItem>
                </>
              )
              : (
                <NavItem to="/login">
                  Login
                </NavItem>
              )}
            <li className="h-full">
              <Button
                variant="ghost"
                className="h-full hover:bg-slate-200 dark:hover:bg-slate-700 hover:opacity-100 active:opacity-100"
                onClick={changeTheme}
              >
                {theme == "dark"
                  ? <MoonIcon className="size-6" />
                  : <SunIcon className="size-6" />}
              </Button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

interface NavItemProps {
  to: To;
  children: React.ReactNode;
}

function NavItem({ to, children }: NavItemProps) {
  const base: string =
    "flex items-center justify-center rounded-full h-full px-5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all";

  return (
    <li className="h-full">
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive ? base + " bg-slate-200 dark:bg-slate-700" : base}
      >
        {children}
      </NavLink>
    </li>
  );
}

export default Navbar;
