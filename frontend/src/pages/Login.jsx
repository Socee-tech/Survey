import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, LogIn } from "lucide-react";
import API from "../../API/API";
import { toast, Toaster } from "sonner";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);
        const id = toast.loading("Logging in...");

        try {
            const res = await API.post("/auth/login", form);
            toast.success(res.data.message || "Login successful", { id });

            console.log("Login response:", res);

            /*
              The backend should return something such as:
      
              {
                message: "Login successful",
                token: "..."
              }
            */

            localStorage.setItem("token", res.data.token);

            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login failed", { description: error.message || "Check your credentials and try again.", id });

            setError(
                error.response?.data?.message ||
                "Unable to login. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-center" richColors />
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center px-4">

                <div className="w-full max-w-md">

                    {/* Header */}
                    <div className="text-center mb-8">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-500/20">
                            <LockKeyhole size={26} />
                        </div>

                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Admin Login
                        </h1>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Sign in to manage survey responses
                        </p>

                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">

                        {error && (
                            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Email
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="admin@example.com"
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                    />

                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Password
                                </label>

                                <div className="relative">

                                    <LockKeyhole
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your password"
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
                                    />

                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <LogIn size={18} />

                                {loading ? "Signing in..." : "Sign in"}
                            </button>

                        </form>

                    </div>

                    <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-500">
                        Authorized administrators only
                    </p>

                </div>
            </div>
        </>
    );
}

export default Login;