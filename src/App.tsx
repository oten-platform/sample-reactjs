import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
import { useAuth } from './hooks/use-auth';

function App() {
  const { isAuthenticated, isLoading, error, clearError, loginWithRedirect } = useAuth();

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-state">
          <div className="loading-text">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="main-card-wrapper">
          <div className="error-section">
            <div className="error-icon">⚠️</div>
            <h1 className="error-title">Authentication Error</h1>
            <p className="error-message">{error.message}</p>
            <div className="error-actions">
              <button onClick={clearError} className="button logout">
                Dismiss
              </button>
              <button
                onClick={() => {
                  clearError();
                  loginWithRedirect();
                }}
                className="button login"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-card-wrapper">
        <h1 className="main-title">Welcome to Oten IDP Sample</h1>

        {isAuthenticated ? (
          <div className="logged-in-section">
            <div className="logged-in-message">✅ Successfully authenticated!</div>
            <h2 className="profile-section-title">Your Profile</h2>
            <div className="profile-card">
              <Profile />
            </div>
            <LogoutButton />
          </div>
        ) : (
          <div className="action-card">
            <p className="action-text">Get started by signing in to your account</p>
            <LoginButton />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;