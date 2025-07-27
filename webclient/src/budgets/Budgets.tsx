import { useAuth } from "../components/AuthProvider.tsx";

function Budgets() {
  const { isAuthenticated } = useAuth();
  console.log(`IS Authenticated: ${isAuthenticated}`);
  return <div>Budgets</div>;
}

export default Budgets;
