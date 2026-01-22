import { useAuth } from "../hooks/use-auth";

const LogoutButton = () => {
    const { logoutWithRedirect } = useAuth();

    return (
        <button
            onClick={logoutWithRedirect}
            className="button logout"
        >
            Log Out
        </button>
    );
};

export default LogoutButton;