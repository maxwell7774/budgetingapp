import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import AppLayout from './app-layout.tsx';
import About from './about/about.tsx';
import Login from './login/login.tsx';
import Profile from './profile/profile.tsx';
import { AuthProvider } from './components/auth-provider.tsx';
import Budgets from './budgets/budgets.tsx';
import { APIClientProvider } from './components/api/api-client-provider.tsx';
import Register from './register/register.tsx';
import BudgetDetails from './budgets/id/budget-details.tsx';
import Home from './home/home.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <APIClientProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<AppLayout />}>
                            <Route path='/' element={<Home />} />
                            <Route path='/about' element={<About />} />
                            <Route path='/budgets' element={<Budgets />} />
                            <Route
                                path='/budgets/:id'
                                element={<BudgetDetails />}
                            />
                            <Route path='/login' element={<Login />} />
                            <Route path='/register' element={<Register />} />
                            <Route path='/profile' element={<Profile />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </APIClientProvider>
        </AuthProvider>
    </StrictMode>,
);
