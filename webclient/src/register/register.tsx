import useUsers from "../components/api/users.ts";
import { useLogin } from "../components/auth-provider.tsx";
import { useNavigate } from "react-router";
import { Button, Input } from "../components/ui/index.ts";

function Register() {
  const navigate = useNavigate();
  const { createUser } = useUsers();
  const login = useLogin();

  const handleSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (password !== confirmPassword) {
      return;
    }

    const user = await createUser({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    });

    await login(user.email, password);
    navigate("/");
  };

  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-[32rem] bg-indigo-500 dark:bg-indigo-800 -z-10 isolate">
      </div>
      <form
        className="bg-white dark:bg-slate-800 shadow-md mx-auto max-w-xl p-10 rounded-3xl space-y-8 mt-32"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl font-bold text-center">
          Sign in to start budgeting!
        </h1>
        <div>
          <label className="block mb-1 font-bold text-slate-800 dark:text-slate-200">
            First Name
          </label>
          <Input
            name="first_name"
            type="text"
            className="dark:bg-slate-900"
            placeholder="type here..."
          />
        </div>
        <div>
          <label className="block mb-1 font-bold text-slate-800 dark:text-slate-200">
            Last Name
          </label>
          <Input
            name="last_name"
            type="text"
            className="dark:bg-slate-900"
            placeholder="type here..."
          />
        </div>
        <div>
          <label className="block mb-1 font-bold text-slate-800 dark:text-slate-200">
            Email
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
        <div>
          <label className="block mb-1 font-bold text-slate-800 dark:text-slate-200">
            Confirm Password
          </label>
          <Input
            name="confirm_password"
            type="password"
            className="text-xs placeholder:text-base dark:bg-slate-900"
            placeholder="type here..."
          />
        </div>
        <div>
          <Button className="w-full" type="submit">Register</Button>
        </div>
      </form>
    </>
  );
}

export default Register;
