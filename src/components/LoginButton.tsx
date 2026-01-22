import { useAuth } from "../hooks/use-auth";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth();

    return (
        <button
            onClick={loginWithRedirect}
            className="button login"
        >
            Log In
        </button>
    );
};

export default LoginButton;