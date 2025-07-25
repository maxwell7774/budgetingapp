import Button from "../components/ui/Button.tsx";
import Input from "../components/ui/Input.tsx";

interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const loginData: LoginForm = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    fetch(
      "/api/v1/login",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(loginData),
      },
    ).then((res) => console.log(res));
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
