import Navbar from "./components/Navbar.tsx";

function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="flex-1">
        Hello
      </main>
      <footer className="border-t h-20"></footer>
    </>
  );
}

export default App;
