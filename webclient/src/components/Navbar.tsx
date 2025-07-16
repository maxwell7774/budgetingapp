import { useState } from "react";

function Navbar() {
  return (
    <nav className="border-b bg-amber-950 p-8">
      <div className="max-w-7xl mx-auto flex items-center">
        <ul className="ms-auto flex gap-8 h-full items-center">
          <li>Test1</li>
          <li>Test2</li>
          <li>Test3</li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
