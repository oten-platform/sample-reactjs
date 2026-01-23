# Oten IDP React Sample

[![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?logo=vite)](https://vitejs.dev/)
[![react-oidc-context](https://img.shields.io/badge/react--oidc--context-3.3.0-green)](https://github.com/authts/react-oidc-context)

A sample React application demonstrating authentication with **Oten IDP** using OpenID Connect (OIDC) and OAuth 2.0.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [API Reference](#api-reference)
- [Code Examples](#-code-examples)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#-security-best-practices)
- [Available Scripts](#-available-scripts)
- [Contributing](#-contributing)
- [Support](#-support)

## 🎯 Overview

This sample application demonstrates how to:

- ✅ Authenticate users with Oten IDP using Authorization Code Flow with PKCE
- ✅ Handle login and logout flows with redirects
- ✅ Manage authentication state with React Context
- ✅ Store and retrieve user tokens securely
- ✅ Handle token expiration and session management
- ✅ Make authenticated API calls using access tokens

### Why react-oidc-context?

This sample uses [`react-oidc-context`](https://github.com/authts/react-oidc-context), a lightweight React wrapper around `oidc-client-ts` that provides:

- 🎯 **Simple API** - Clean React hooks interface (`useAuth()`)
- 🔄 **Automatic Token Renewal** - Handles token refresh automatically
- 📦 **Minimal Setup** - Just wrap your app with `<AuthProvider>`
- 🛡️ **Type Safe** - Full TypeScript support out of the box
- ⚡ **React-First** - Built specifically for React applications
- 🧪 **Well Tested** - Battle-tested in production applications

## ✨ Features

- **🔐 Secure Authentication** - OAuth 2.0 / OpenID Connect with PKCE
- **⚛️ Modern React** - Built with React 19, TypeScript, and Vite
- **🎨 Beautiful UI** - Glassmorphism design with smooth animations
- **🔄 Session Management** - Automatic token storage and expiration handling
- **⚡ Fast Development** - Hot module replacement with Vite
- **📦 Minimal Dependencies** - Uses `react-oidc-context` for seamless authentication
- **🛡️ Type Safe** - Full TypeScript support

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- An **Oten IDP account** with a configured application

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/oten-platform/sample-reactjs.git
cd sample-reactjs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Oten IDP Application

1. Log in to your [Oten Developer Portal](https://developer.oten.live)
2. Create a new application or select an existing one
3. Configure the following settings:
   - **Application Type**: Single Page Application (SPA)
   - **Redirect URIs**: `http://localhost:5173`
   - **Logout URIs**: `http://localhost:5173`
   - **Allow Origins (CORS):**: `http://localhost:5173`
   - **Allowed Scopes**: `openid`, `profile`, `email`

4. Save your configuration and note your:
   - **Authority URL** (`https://account.oten.live/`)
   - **Client ID**

### 4. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
VITE_OTEN_IDP_AUTH_DOMAIN=https://account.oten.live/
VITE_OTEN_IDP_CLIENT_ID=your_client_id_here
```

> ⚠️ **Important**: Never commit your `.env` file to version control. Add it to `.gitignore`.

### 5. Run the Application

```bash
npm run dev
```

The application will start at **http://localhost:5173**

### 6. Test the Authentication Flow

1. Open http://localhost:5173 in your browser
2. Click the **"Log In"** button
3. You'll be redirected to Oten IDP login page
4. Enter your credentials
5. After successful authentication, you'll be redirected back to the app
6. Your profile information will be displayed

## ⚙️ Configuration

### Environment Variables

| Variable                    | Required | Description                  | Example                      |
| --------------------------- | -------- | ---------------------------- | ---------------------------- |
| `VITE_OTEN_IDP_AUTH_DOMAIN` | ✅ Yes   | Oten IDP authority URL       | `https://account.oten.live/` |
| `VITE_OTEN_IDP_CLIENT_ID`   | ✅ Yes   | Your application's client ID | `abc123xyz...`               |

### OIDC Configuration

The OIDC settings are configured in `src/main.tsx`:

```typescript
import { AuthProvider, type AuthProviderProps } from 'react-oidc-context';

const oidcConfig: AuthProviderProps = {
  authority: import.meta.env.VITE_OTEN_IDP_AUTH_DOMAIN,
  client_id: import.meta.env.VITE_OTEN_IDP_CLIENT_ID,
  redirect_uri: window.location.origin,
  post_logout_redirect_uri: window.location.origin,
  scope: 'openid profile email',
  onSigninCallback: () => {
    // Clean up URL after successful authentication
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

// Wrap your app with AuthProvider
<AuthProvider {...oidcConfig}>
  <App />
</AuthProvider>
```

## 📂 Project Structure

```
sample-reactjs/
├── src/
│   ├── components/
│   │   ├── LoginButton.tsx      # Login button component
│   │   ├── LogoutButton.tsx     # Logout button component
│   │   └── Profile.tsx          # User profile display
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # App entry point with AuthProvider setup
│   └── index.css                # Global styles
├── .env                         # Environment variables (create this)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔍 How It Works

### Authentication Flow

```
┌─────────┐              ┌──────────────┐              ┌──────────────┐
│  User   │              │  React App   │              │  Oten IDP    │
└────┬────┘              └──────┬───────┘              └──────┬───────┘
     │                          │                             │
     │  1. Click "Log In"       │                             │
     ├─────────────────────────>│                             │
     │                          │                             │
     │                          │  2. Redirect to /authorize  │
     │                          │     (with PKCE)             │
     │                          ├────────────────────────────>│
     │                          │                             │
     │  3. Redirected to Oten IDP login page                  │
     │<───────────────────────────────────────────────────────┤
     │                          │                             │
     │  4. Enter credentials    │                             │
     ├────────────────────────────────────────────────────────>
     │                          │                             │
     │  5. Redirect back with auth code                       │
     │<───────────────────────────────────────────────────────┤
     │                          │                             │
     │  6. Callback to app      │                             │
     ├─────────────────────────>│                             │
     │                          │                             │
     │                          │  7. Exchange code for tokens│
     │                          ├────────────────────────────>│
     │                          │                             │
     │                          │  8. Return access_token &   │
     │                          │     id_token                │
     │                          │<────────────────────────────┤
     │                          │                             │
     │                          │  9. Store tokens in         │
     │                          │     sessionStorage          │
     │                          │                             │
     │  10. Show profile        │                             │
     │<─────────────────────────┤                             │
     │                          │                             │
```

### Key Components

#### **AuthProvider** (from `react-oidc-context`)

The authentication provider from `react-oidc-context` that:

- Manages user authentication state automatically
- Handles login/logout flows
- Processes OAuth callbacks
- Manages token lifecycle
- Handles authentication errors
- Provides automatic token renewal

#### **useAuth Hook** (from `react-oidc-context`)

Components import the `useAuth` hook directly from `react-oidc-context` to access authentication state and methods:

```typescript
import { useAuth } from "react-oidc-context";

const auth = useAuth();

// Available properties:
auth.user; // Current user object (null if not authenticated)
auth.isAuthenticated; // Boolean authentication status
auth.isLoading; // Loading state during initialization
auth.error; // Authentication errors
auth.signinRedirect(); // Function to initiate login
auth.signoutRedirect(); // Function to initiate logout
auth.removeUser(); // Function to clear user state
```

#### **Components**

- **LoginButton** - Triggers the OAuth login flow using `auth.signinRedirect()`
- **LogoutButton** - Logs out the user using `auth.signoutRedirect()`
- **Profile** - Displays authenticated user information from `auth.user`

### Automatic Features

`react-oidc-context` automatically handles:

- **Token Storage** - Securely stores tokens in session/local storage
- **Token Renewal** - Automatically renews tokens before expiration
- **Callback Processing** - Handles OAuth callback parameters
- **Error Management** - Provides error state for authentication failures

## 📚 API Reference

### useAuth() Hook

```typescript
import { useAuth } from "./hooks/use-auth";

function MyComponent() {
  const auth = useAuth();

  // Use authentication state and methods
  if (auth.isAuthenticated) {
    console.log(auth.user);
  }
}
```

#### Key Properties and Methods

| Property/Method     | Type                  | Description                       |
| ------------------- | --------------------- | --------------------------------- |
| `user`              | `User \| null`        | Current authenticated user object |
| `isAuthenticated`   | `boolean`             | Whether user is authenticated     |
| `isLoading`         | `boolean`             | Whether auth is initializing      |
| `error`             | `Error \| undefined`  | Any authentication error          |
| `signinRedirect()`  | `() => Promise<void>` | Initiates login flow              |
| `signoutRedirect()` | `() => Promise<void>` | Initiates logout flow             |
| `removeUser()`      | `() => Promise<void>` | Removes user from storage         |
| `signinSilent()`    | `() => Promise<void>` | Silently renews authentication    |
| `activeNavigator`   | `string`              | Current navigation state          |

### User Object

```typescript
{
  profile: {
    sub: string;           // User ID
    name: string;          // Full name
    email: string;         // Email address
    picture?: string;      // Profile picture URL
    // ... other claims from your IDP
  },
  access_token: string;    // Access token
  id_token: string;        // ID token
  expires_at: number;      // Token expiration timestamp
}
```

### Making Authenticated API Calls

```typescript
import { useAuth } from "./hooks/use-auth";

function MyComponent() {
  const auth = useAuth();

  const fetchProtectedData = async () => {
    if (!auth.isAuthenticated || !auth.user) return;

    const response = await fetch("https://api.example.com/protected", {
      headers: {
        Authorization: `Bearer ${auth.user.access_token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  };

  // Use fetchProtectedData in your component
}
```

## 🐛 Troubleshooting

### Common Issues

#### **"Redirect URI mismatch" Error**

**Problem**: The redirect URI doesn't match what's configured in Oten Developer Portal.

**Solution**:

- Verify `VITE_REDIRECT_URI` matches exactly what's in your Oten Developer Portal dashboard
- Include the protocol (`http://` or `https://`)
- Don't include trailing slashes unless configured that way
- For development, use `http://localhost:5173`

#### **"Invalid Client" Error**

**Problem**: Client ID is incorrect or client is not configured properly.

**Solution**:

- Double-check `VITE_OTEN_IDP_CLIENT_ID` in your `.env` file
- Ensure the client is enabled in Oten Developer Portal dashboard
- Verify the client is configured for Authorization Code Flow

#### **"No matching state found in storage" Error**

**Problem**: Authentication fails with state mismatch error after redirect.

**Solution**:

- Clear browser storage (Application → Storage → Clear site data in DevTools)
- Ensure `onSigninCallback` is properly configured in `src/main.tsx`
- Verify you're not using `matchSignoutCallback` incorrectly
- Try in incognito/private mode to rule out storage issues
- Check that cookies and sessionStorage are enabled

#### **Session Lost on Page Refresh**

**Problem**: User is logged out when refreshing the page.

**Solution**:

- Check browser console for sessionStorage errors
- Verify sessionStorage is enabled in browser settings
- Ensure cookies are enabled (required for OIDC)
- Check that your domain is not blocking third-party cookies

#### **CORS Errors**

**Problem**: Browser blocks requests to Oten IDP.

**Solution**:

- Ensure `http://localhost:5173` is added to Allow Origins (CORS) in Oten Developer Portal dashboard
- Verify the authority URL is correct and accessible
- Check CORS settings in your Oten IDP application

#### **Token Expiration Issues**

**Problem**: Access token expires and user is logged out.

**Solution**:

- This is expected behavior when tokens expire
- The app shows an error message: "Your session has expired"
- User needs to log in again
- For automatic renewal, implement silent token refresh (advanced)

### Debug Mode

Open the browser console (F12) to see detailed logs:

- Authentication events are logged with emoji prefixes
- Check for error messages and stack traces
- Verify token storage in Application → Session Storage

## 🔒 Security Best Practices

This sample implements several security best practices:

- ✅ **Authorization Code Flow with PKCE** - Most secure OAuth flow for SPAs
- ✅ **State Parameter** - CSRF protection (handled by react-oidc-context)
- ✅ **Nonce Validation** - Replay attack protection (handled by react-oidc-context)
- ✅ **Token Storage** - Tokens stored in sessionStorage (consider httpOnly cookies for production)
- ✅ **HTTPS Required** - Always use HTTPS in production
- ✅ **Error Handling** - Comprehensive error handling and user feedback
- ✅ **Automatic Token Renewal** - Silent token refresh handled automatically

### Production Recommendations

1. **Use HTTPS** - Always serve your app over HTTPS in production
2. **Environment Variables** - Never commit `.env` to version control
3. **Content Security Policy** - Add CSP headers to prevent XSS attacks
4. **Token Rotation** - Implement refresh token rotation if supported by your IDP
5. **Session Monitoring** - Track and monitor active user sessions
6. **Rate Limiting** - Implement rate limiting on authentication endpoints
7. **Audit Logging** - Log authentication events for security monitoring

## 💻 Code Examples

### Complete Component Examples

#### Login Button

```typescript
import { useAuth } from "react-oidc-context";

const LoginButton = () => {
  const { signinRedirect } = useAuth();

  return (
    <button onClick={() => signinRedirect()} className="button login">
      Log In
    </button>
  );
};
```

#### Logout Button

```typescript
import { useAuth } from "react-oidc-context";

const LogoutButton = () => {
  const { signoutRedirect } = useAuth();

  return (
    <button onClick={() => signoutRedirect()} className="button logout">
      Log Out
    </button>
  );
};
```

#### Profile Component

```typescript
import { useAuth } from "react-oidc-context";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div>
      <img src={user.profile.picture} alt={user.profile.name} />
      <h2>{user.profile.name}</h2>
      <p>{user.profile.email}</p>
    </div>
  );
};
```

#### Protected Route Example

```typescript
import { useAuth } from "react-oidc-context";

const ProtectedComponent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view this content.</div>;
  }

  return <div>Protected content here!</div>;
};
```

#### Error Handling Example

```typescript
import { useAuth } from "react-oidc-context";

function App() {
  const { error, isLoading, signinRedirect, removeUser } = useAuth();

  if (error) {
    return (
      <div>
        <h1>Authentication Error</h1>
        <p>{error.message}</p>
        <button onClick={async () => {
          await removeUser();
          window.location.href = '/';
        }}>
          Dismiss
        </button>
        <button onClick={() => signinRedirect()}>
          Try Again
        </button>
      </div>
    );
  }

  // Rest of your app...
}
```

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

This sample application is provided as-is for educational and integration purposes.

## 🆘 Support

- **Documentation**: [Oten IDP Documentation](https://oten.gitbook.io/idp-support/integration/integration-document)
- **Need help**: [Oten IDP Support](https://oten.gitbook.io/idp-support/integration/integration-document#need-help)
- **GitHub Issues**: [GitHub Issues](https://github.com/oten-platform/sample-reactjs/issues)

---

**Built with ❤️ using React, TypeScript, and Oten IDP**
