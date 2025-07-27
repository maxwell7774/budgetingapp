import { useAuth, useLogin } from "../components/AuthProvider.tsx";
import { useNavigate } from "react-router";
import Button from "../components/ui/Button.tsx";
import Input from "../components/ui/Input.tsx";
import { useEffect } from "react";

function Login() {
  const auth = useAuth();
  const login = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/");
    }
  }, [auth.isAuthenticated]);

  const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await login(email, password);
  };

  return (
    <form
      className="bg-white dark:bg-slate-800 shadow-md mx-auto max-w-xl p-10 rounded-3xl space-y-8 mt-32"
      onSubmit={handleSubmit}
    >
      <h1 className="text-xl font-bold text-center">
        Sign in to start budgeting!
      </h1>
      <div>
        <label className="block mb-1 font-bold text-slate-800 dark:text-slate-200">
          Username/Email
        </label>
        <Input
          name="email"
          type="text"
          className="dark:bg-slate-900"
          placeholder="type here..."
        />
      </div>
      <div>
        <label className="block mb-1 font-bold text-slate-800 dark:text-slate-200">
          Password
        </label>
        <Input
          name="password"
          type="password"
          className="text-xs placeholder:text-base dark:bg-slate-900"
          placeholder="type here..."
        />
      </div>
      <div className="w-48 ms-auto">
        <Button className="w-full" type="submit">Login</Button>
      </div>
    </form>
  );
}

export default Login;
