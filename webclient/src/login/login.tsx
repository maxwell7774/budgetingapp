import { useAuth, useLogin } from "../components/auth-provider.tsx";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Button, Input } from "../components/ui/index.ts";

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
    <>
      <div className="absolute top-0 left-0 right-0 h-[32rem] bg-indigo-500 dark:bg-indigo-800 -z-10 isolate">
      </div>
      <form
        className="bg-white dark:bg-slate-800 shadow-md mx-auto max-w-xl p-10 rounded-3xl space-y-8"
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
            className="dark:bg-slate-900"
            placeholder="type here..."
          />
        </div>
        <div className="space-y-4">
          <Button className="w-full" type="submit">Login</Button>
          <div className="flex items-center justify-center gap-4">
            <div className="border-b border-slate-300 dark:border-slate-600 flex-1">
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-600">OR</p>
            <div className="border-b border-slate-300 dark:border-slate-600 flex-1">
            </div>
          </div>
          <Button
            className="w-full"
            type="button"
            variant="outline"
            onClick={() => navigate("/register")}
          >
            Create Account
          </Button>
        </div>
      </form>
    </>
  );
}

export default Login;
