import { useAuth } from "react-oidc-context";

const LoginButton = () => {
    const { signinRedirect } = useAuth();

    return (
        <button
            onClick={() => signinRedirect()}
            className="button login"
        >
            Log In
        </button>
    );
};

export default LoginButton;