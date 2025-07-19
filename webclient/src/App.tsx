import Navbar from "./components/Navbar.tsx";

function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="flex-1 p-8">
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
        <div className="grid grid-cols-[max-content_max-content] place-content-center gap-20">
          <div className="w-96 bg-white rounded-xl text-indigo-950 shadow-lg ring ring-black/5 text-center">
            <h1 className="pt-4 text-center font-bold text-indigo-500 text-xl">
              Best Plan Ever
            </h1>
            <ul className="m-4 text-indigo-600 font-semibold grid grid-cols-2 gap-4">
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Adam's Income
              </li>
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Beth's Income
              </li>
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Groceries
              </li>
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Play Money
              </li>
            </ul>
            <div className="ms-auto">
              <button
                className="w-full bg-indigo-500 text-white font-semibold h-11 px-5 hover:opacity-80 hover:cursor-pointer active:opacity-60 transition-opacity rounded-b-xl"
                type="button"
              >
                Add Item
              </button>
            </div>
          </div>
          <div className="w-96 bg-white rounded-xl text-indigo-950 shadow-lg ring ring-black/5 text-center">
            <h1 className="pt-4 text-center font-bold text-indigo-500 text-xl">
              Best Plan Ever
            </h1>
            <ul className="m-4 text-indigo-600 font-semibold grid grid-cols-2 gap-4">
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Adam's Income
              </li>
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Beth's Income
              </li>
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Groceries
              </li>
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Play Money
              </li>
            </ul>
            <div className="ms-auto">
              <button
                className="w-full bg-indigo-500 text-white font-semibold h-11 px-5 hover:opacity-80 hover:cursor-pointer active:opacity-60 transition-opacity rounded-b-xl"
                type="button"
              >
                Add Item
              </button>
            </div>
          </div>
          <div className="w-96 bg-white rounded-xl text-indigo-950 shadow-lg ring ring-black/5 text-center">
            <h1 className="pt-4 text-center font-bold text-indigo-500 text-xl">
              Best Plan Ever
            </h1>
            <ul className="m-4 text-indigo-600 font-semibold grid grid-cols-2 gap-4">
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Adam's Income
              </li>
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Beth's Income
              </li>
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Groceries
              </li>
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Play Money
              </li>
            </ul>
            <div className="ms-auto">
              <button
                className="w-full bg-indigo-500 text-white font-semibold h-11 px-5 hover:opacity-80 hover:cursor-pointer active:opacity-60 transition-opacity rounded-b-xl"
                type="button"
              >
                Add Item
              </button>
            </div>
          </div>
          <div className="w-96 bg-white rounded-xl text-indigo-950 shadow-lg ring ring-black/5 text-center">
            <h1 className="pt-4 text-center font-bold text-indigo-500 text-xl">
              Best Plan Ever
            </h1>
            <ul className="m-4 text-indigo-600 font-semibold grid grid-cols-2 gap-4">
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Adam's Income
              </li>
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Beth's Income
              </li>
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Groceries
              </li>
              <li className="bg-indigo-100 w-full py-1 px-2 rounded-full">
                Play Money
              </li>
            </ul>
            <div className="ms-auto">
              <button
                className="w-full bg-indigo-500 text-white font-semibold h-11 px-5 hover:opacity-80 hover:cursor-pointer active:opacity-60 transition-opacity rounded-b-xl"
                type="button"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-indigo-200 h-20"></footer>
    </>
  );
}

export default App;
