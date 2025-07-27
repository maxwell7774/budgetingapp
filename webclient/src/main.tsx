import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./home/App.tsx";
import AppLayout from "./AppLayout.tsx";
import About from "./about/About.tsx";
import Login from "./login/login.tsx";
import Profile from "./profile/Profile.tsx";
import { AuthProvider } from "./components/AuthProvider.tsx";
import Budgets from "./budgets/Budgets.tsx";
import { APIClientProvider } from "./components/api/APIClientProvider.tsx";
import Register from "./register/Register.tsx";
import BudgetDetails from "./budgets/id/BudgetDetails.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <APIClientProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<App />} />
              <Route path="/about" element={<About />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/budgets/:id" element={<BudgetDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </APIClientProvider>
    </AuthProvider>
  </StrictMode>,
);
