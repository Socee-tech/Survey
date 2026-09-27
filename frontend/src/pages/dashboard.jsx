import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Eye,
    Trash2,
    LogOut,
    Users,
    X,
} from "lucide-react";

import API from "../../API/API";
import ThemeToggle from "../components/themeToggle";
import { toast, Toaster } from "sonner";

function Dashboard() {
    const navigate = useNavigate();
    const [dark, setDark] = useState(() => localStorage.theme === "dark" || (!localStorage.theme && window.matchMedia("(prefers-color-scheme: dark)").matches));

    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadResponses = async () => {
            try {
                const res = await API.get("/responses");
                console.log("Responses loaded:", res.data);

                if (!cancelled) {
                    setResponses(res.data.responses);
                }
            } catch (error) {
                console.error(error);

                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }

                if (!cancelled) {
                    setError(
                        error.response?.data?.message ||
                        "Unable to load responses."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadResponses();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this response?"
        );

        if (!confirmed) return;
        const id1 = toast.loading("Deleting response...");

        try {

            await API.delete(`/responses/${id}`);

            setResponses((current) =>
                current.filter((response) => response._id !== id)
            );
            toast.success("Response deleted successfully", { id: id1 });

        } catch (error) {
            console.error(error);
            toast.error("Failed to delete response", { id: id1 });

            setError(
                error.response?.data?.message ||
                "Unable to delete response."
            );
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <>
            <Toaster position="top-center" richColors />
            <div className="min-h-screen bg-slate-100 dark:bg-slate-950">

                {/* Navbar */}
                <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                                Survey Admin
                            </h1>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Response management
                            </p>
                        </div>

                        <ThemeToggle dark={dark} onToggle={() => setDark((value) => !value)} />

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
                        >
                            <LogOut size={17} />
                            Logout
                        </button>

                    </div>

                </header>


                {/* Main */}
                <main className="mx-auto max-w-7xl px-6 py-8">

                    {/* Page heading */}
                    <div className="mb-8 flex items-center justify-between">

                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Survey Responses
                            </h2>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                View and manage submitted responses.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">

                            <Users className="text-purple-600" size={20} />

                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Total responses
                                </p>

                                <p className="font-bold text-slate-900 dark:text-white">
                                    {responses.length}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Error */}
                    {error && (
                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                            {error}
                        </div>
                    )}


                    {/* Loading */}
                    {loading ? (

                        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">

                            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600" />

                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Loading responses...
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                            <div className="overflow-x-auto">

                                <table className="w-full text-left">

                                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">

                                        <tr>

                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                Name
                                            </th>

                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                University
                                            </th>

                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                Study Level
                                            </th>

                                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                Year
                                            </th>

                                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">

                                        {responses.map((response) => (

                                            <tr
                                                key={response._id}
                                                className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                            >

                                                <td className="px-6 py-4">

                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        {response.name}
                                                    </p>

                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {response.email}
                                                    </p>

                                                </td>

                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                    {response.university}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                    {response.studyLevel}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                    {response.year}
                                                </td>

                                                <td className="px-6 py-4">

                                                    <div className="flex justify-end gap-2">

                                                        <button
                                                            onClick={() =>
                                                                setSelectedResponse(response)
                                                            }
                                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950/40 dark:hover:text-purple-400"
                                                            title="View response"
                                                        >
                                                            <Eye size={18} />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(response._id)
                                                            }
                                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                                            title="Delete response"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )}


                </main>


                {/* Response modal */}
                {selectedResponse && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

                        <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900">

                            {/* Modal header */}
                            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900">

                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        Full Response
                                    </h3>

                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {selectedResponse.name}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedResponse(null)}
                                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                >
                                    <X size={20} />
                                </button>

                            </div>


                            {/* Response fields */}
                            <div className="grid gap-4 p-6 sm:grid-cols-2">

                                {Object.entries(selectedResponse).map(
                                    ([key, value]) => {

                                        if (key === "_id" || key === "__v") {
                                            return null;
                                        }

                                        return (
                                            <div
                                                key={key}
                                                className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50"
                                            >

                                                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400">
                                                    {key}
                                                </p>

                                                <p className="text-sm text-slate-700 dark:text-slate-200">
                                                    {String(value)}
                                                </p>

                                            </div>
                                        );

                                    }
                                )}

                            </div>

                        </div>

                    </div>

                )}

            </div>
        </>
    );
}

export default Dashboard;