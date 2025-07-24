import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./home/App.tsx";
import AppLayout from "./AppLayout.tsx";
import About from "./about/About.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
