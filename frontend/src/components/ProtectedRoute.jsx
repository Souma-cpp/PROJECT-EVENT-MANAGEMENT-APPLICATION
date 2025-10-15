import React from "react";
import { Navigate } from "react-router-dom";
import api from "../utils/axios.js";

const ProtectedRoute = ({ children }) => {
    const token = api.defaults.headers.common["Authorization"]; // check if access token exists in memory
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute
