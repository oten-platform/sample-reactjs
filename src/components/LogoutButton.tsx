import { useAuth } from "react-oidc-context";

const LogoutButton = () => {
    const { signoutRedirect } = useAuth();

    return (
        <button
            onClick={() => signoutRedirect()}
            className="button logout"
        >
            Log Out
        </button>
    );
};

export default LogoutButton;