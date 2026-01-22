import { useContext } from "react";
import { AuthContext } from "../providers/auth-provider";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        console.warn("AuthProvider context is undefined, please verify you are calling useAuth() as child of a <AuthProvider> component.");
    }
    return context;
};