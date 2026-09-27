import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    console.log("Checking if user is authenticated...");

    if (!token) {
        console.log("No token found, redirecting to login.");
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;