function Navbar() {
  return (
    <nav className="p-8">
      <div className="max-w-7xl mx-auto flex items-center">
        <div>
          <a className="text-2xl font-bold flex items-center" href="/">
            <img className="w-10" src="/logo.svg" />
            26volts
          </a>
        </div>
        <ul className="ms-auto flex gap-8 h-full items-center font-semibold">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/login">Login</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
