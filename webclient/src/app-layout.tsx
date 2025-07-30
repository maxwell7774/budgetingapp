import { Outlet } from "react-router";
import Navbar from "./components/navbar.tsx";

function AppLayout() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto my-8">
        {/* <div className="mb-8"> */}
        {/*   <button */}
        {/*     className="me-8 h-11 border-2 border-indigo-500 text-cyan-500 hover:bg-cyan-500/10 px-5 hover:opacity-80 hover:cursor-pointer active:opacity-60 transition-opacity rounded-full font-semibold" */}
        {/*     type="button" */}
        {/*   > */}
        {/*     Add Item */}
        {/*   </button> */}
        {/*   <button */}
        {/*     className="h-11 bg-indigo-50 text-cyan-600 px-5 hover:bg-cyan-100 hover:cursor-pointer active:bg-cyan-200 transition-opacity rounded-full font-semibold" */}
        {/*     type="button" */}
        {/*   > */}
        {/*     Add Item */}
        {/*   </button> */}
        {/* </div> */}
        {/* <div className="bg-[url(/test-pattern-2.svg)] absolute inset-0 -z-10 isolate bg-no-repeat bg-top bg-size-[100%]"> */}
        {/* </div> */}
        {/* <img */}
        {/*   className=" absolute top-0 object-top object-fill" */}
        {/*   src="test-pattern.svg" */}
        {/* /> */}
        <Outlet />
      </main>
      <footer className="text-center rounded-full">
        <p className="bg-slate-200 dark:bg-slate-800 p-2 px-8 w-max mx-auto rounded-full flex items-center">
          <span className="me-1">
            Guppy Goals &bull; a product by
          </span>
          <span className="-me-0.5">
            <img className="w-4" src="/logo.svg" />
          </span>
          <span className="font-bold">
            27actions
          </span>
        </p>
      </footer>
    </>
  );
}

export default AppLayout;
