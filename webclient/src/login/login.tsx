import Button from "../components/ui/Button.tsx";
import Input from "../components/ui/Input.tsx";

function Login() {
  return (
    <form
      className="bg-white dark:bg-slate-800 shadow-md mx-auto max-w-xl p-10 rounded-3xl space-y-8 mt-32"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Hello there");
      }}
    >
      <h1 className="text-xl font-bold text-center">
        Sign in to start budgeting!
      </h1>
      <div>
        <label className="block mb-1 font-bold text-slate-800 dark:text-slate-200">
          Username/Email
        </label>
        <Input
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
