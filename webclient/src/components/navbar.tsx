import { useState } from "react";
import { Link, NavLink, To } from "react-router";
import { useAuth } from "./auth-provider.tsx";
import { Button } from "./ui/index.ts";
import { EllipsisIcon, MoonIcon, SunIcon } from "./ui/icons/index.ts";

function Navbar() {
  const { isAuthenticated } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("theme"));
  const [open, setOpen] = useState(false);

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
    <header className="sticky top-4 md:top-8 left-0 right-0 z-50 isolate mx-4 md:mx-8 mt-4 md:mt-8">
      <nav>
        <div
          data-open={open}
          className="max-w-7xl min-w-max mx-auto flex items-center h-16 bg-white dark:bg-slate-800 md:bg-transparent
                    md:dark:bg-transparent data-[open=true]:rounded-t-4xl data-[open=false]:rounded-full data-[open=false]:delay-150"
        >
          <div className="p-2 h-full bg-white dark:bg-slate-800 rounded-full">
            <Link
              data-open={open}
              className="h-full px-4 sm:px-8 text-xl font-bold flex items-center min-w-max rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
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
              onClick={() => setOpen(!open)}
            >
              <EllipsisIcon className="size-6 min-w-6 min-h-6" />
            </Button>
          </div>
          <div
            data-open={open}
            className="ms-auto md:h-full md:!max-h-fit md:!flex items-center font-semibold gap-0.5 bg-white dark:bg-slate-800 md:rounded-full
                        absolute top-full left-0 right-0 md:static data-[open=true]:shadow-lg rounded-b-4xl
                        data-[open=true]:starting:max-h-0 data-[open=true]:max-h-96 data-[open=true]:block max-h-0 transition-all hidden overflow-hidden transition-discrete"
          >
            <ul
              data-open={open}
              className="block md:flex items-center p-2 gap-0.5 h-full"
            >
              <NavItem to="/" setOpen={setOpen}>
                Home
              </NavItem>
              <NavItem to="/about" setOpen={setOpen}>
                About
              </NavItem>
              {isAuthenticated
                ? (
                  <>
                    <NavItem to="/budgets" setOpen={setOpen}>
                      Budgets
                    </NavItem>
                    <NavItem to="/profile" setOpen={setOpen}>
                      Profile
                    </NavItem>
                  </>
                )
                : (
                  <NavItem to="/login" setOpen={setOpen}>
                    Login
                  </NavItem>
                )}
              <li className="h-full">
                <Button
                  variant="ghost"
                  className="h-11 md:h-full hover:bg-slate-200 dark:hover:bg-slate-700 hover:opacity-100 active:opacity-100 w-full md:w-max"
                  onClick={changeTheme}
                >
                  {theme == "dark"
                    ? <MoonIcon className="size-6" />
                    : <SunIcon className="size-6" />}
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

interface NavItemProps {
  to: To;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

function NavItem({ to, children, setOpen }: NavItemProps) {
  const base: string =
    "flex items-center justify-center rounded-full h-11 md:h-full px-5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all";

  return (
    <li className="h-full">
      <NavLink
        to={to}
        onClick={() => setOpen(false)}
        className={({ isActive }) =>
          isActive ? base + " bg-slate-200 dark:bg-slate-700" : base}
      >
        {children}
      </NavLink>
    </li>
  );
}

export default Navbar;
