import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
    const token = localStorage.getItem("accessToken");

    // If the user already has a valid access token, block access to auth routes
    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AuthRoute;
