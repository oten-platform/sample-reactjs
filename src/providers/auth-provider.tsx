import { User, UserManager, type UserManagerSettings } from 'oidc-client-ts';
import { createContext, useEffect, useRef, useState, type FC, type ReactNode } from 'react';

interface AuthContextType {
    user: User | null;
    error?: Error;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    loginWithRedirect: () => Promise<void>;
    logoutWithRedirect: () => Promise<void>;
    clearError: () => void;
}

const initialAuthContext: AuthContextType = {
    user: null,
    error: undefined,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    loginWithRedirect: async () => { },
    logoutWithRedirect: async () => { },
    clearError: () => { },
};

const AuthContext = createContext<AuthContextType>(initialAuthContext);


const AuthProvider: FC<{ settings: UserManagerSettings; children: ReactNode }> = ({ settings, children }) => {
    const [otenIdpClient] = useState(new UserManager(settings))
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>(undefined);
    const didInitialize = useRef(false);

    useEffect(() => {
        if (didInitialize.current || !otenIdpClient) return;
        didInitialize.current = true;

        (async () => {
            try {
                let user: User | undefined | null = null;
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.has("error")) {
                    throw new Error(urlParams.get("error_description") || "Authentication failed");
                }
                if (urlParams.has("code")) {
                    // Exchange authorization code for tokens
                    user = await otenIdpClient.signinCallback()
                    // Clean up URL by removing OAuth parameters
                    window.history.replaceState({}, document.title, window.location.pathname);
                }

                user = !user ? await otenIdpClient.getUser() : user;
                setUser(user);
            } catch (initError) {
                const error = initError instanceof Error ? initError : new Error('Authentication initialization failed');
                setError(error);
            } finally {
                setIsLoading(false);
            }
        })();

        // Event: User successfully loaded (e.g. initial load, silent renew success))
        const onUserLoaded = (user: User) => {
            setUser(user);
            setError(undefined);
        };

        // Event: Access token has expired 
        const onAccessTokenExpired = () => {
            setUser(null);
            setError(new Error('Your session has expired. Please log in again.'));
        };

        // Event: Silent token renewal failed 
        const onSilentRenewError = () => {
            setError(new Error('Session renewal failed'));
        };

        // Register event listeners
        otenIdpClient.events.addUserLoaded(onUserLoaded);
        otenIdpClient.events.addAccessTokenExpired(onAccessTokenExpired);
        otenIdpClient.events.addSilentRenewError(onSilentRenewError);

        return () => {
            otenIdpClient.events.removeUserLoaded(onUserLoaded);
            otenIdpClient.events.removeAccessTokenExpired(onAccessTokenExpired);
            otenIdpClient.events.removeSilentRenewError(onSilentRenewError);
        };
    }, [otenIdpClient]);

    const loginWithRedirect = async () => {
        try {
            setError(undefined);
            await otenIdpClient.signinRedirect();
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
        }
    };

    const logoutWithRedirect = async () => {
        try {
            setError(undefined);
            await otenIdpClient.signoutRedirect();
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
        }
    };

    const clearError = () => {
        setError(undefined);
    };

    return (
        <AuthContext.Provider value={{
            user,
            error,
            token: user?.access_token || null,
            isLoading,
            isAuthenticated: !!user,
            loginWithRedirect,
            logoutWithRedirect,
            clearError,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
