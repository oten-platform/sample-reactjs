# Oten IDP React Sample

[![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?logo=vite)](https://vitejs.dev/)
[![OIDC Client](https://img.shields.io/badge/oidc--client--ts-3.4.1-green)](https://github.com/authts/oidc-client-ts)

A sample React application demonstrating authentication with **Oten IDP** using OpenID Connect (OIDC) and OAuth 2.0.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## 🎯 Overview

This sample application demonstrates how to:

- ✅ Authenticate users with Oten IDP using Authorization Code Flow with PKCE
- ✅ Handle login and logout flows with redirects
- ✅ Manage authentication state with React Context
- ✅ Store and retrieve user tokens securely
- ✅ Handle token expiration and session management
- ✅ Make authenticated API calls using access tokens

## ✨ Features

- **🔐 Secure Authentication** - OAuth 2.0 / OpenID Connect with PKCE
- **⚛️ Modern React** - Built with React 19, TypeScript, and Vite
- **🎨 Beautiful UI** - Glassmorphism design with smooth animations
- **🔄 Session Management** - Automatic token storage and expiration handling
- **⚡ Fast Development** - Hot module replacement with Vite
- **📦 Minimal Dependencies** - Only `oidc-client-ts` for authentication
- **🛡️ Type Safe** - Full TypeScript support

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- An **Oten IDP account** with a configured application

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd oten-auth-react
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Oten IDP Application

1. Log in to your [Oten IDP Dashboard](https://developer.oten.live)
2. Create a new application or select an existing one
3. Configure the following settings:

   - **Application Type**: Single Page Application (SPA)
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`
   - **Allowed Scopes**: `openid`, `profile`, `email`

4. Save your configuration and note your:
   - **Authority URL** (e.g., `https://account.oten.live/`)
   - **Client ID**

### 4. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
VITE_OTEN_IDP_AUTH_DOMAIN=https://account.oten.live/
VITE_OTEN_IDP_CLIENT_ID=your_client_id_here
```

**Optional environment variables:**

```bash
# Custom redirect URIs (defaults to window.location.origin)
VITE_REDIRECT_URI=http://localhost:5173
VITE_POST_LOGOUT_REDIRECT_URI=http://localhost:5173
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

| Variable                        | Required | Description                      | Example                      |
| ------------------------------- | -------- | -------------------------------- | ---------------------------- |
| `VITE_OTEN_IDP_AUTH_DOMAIN`     | ✅ Yes   | Your Oten IDP authority URL      | `https://account.oten.live/` |
| `VITE_OTEN_IDP_CLIENT_ID`       | ✅ Yes   | Your application's client ID     | `abc123xyz...`               |
| `VITE_REDIRECT_URI`             | ❌ No    | Custom redirect URI after login  | `http://localhost:5173`      |
| `VITE_POST_LOGOUT_REDIRECT_URI` | ❌ No    | Custom redirect URI after logout | `http://localhost:5173`      |

### OIDC Configuration

The OIDC settings are configured in `src/main.tsx`:

```typescript
const oidcSettings: UserManagerSettings = {
  authority: import.meta.env.VITE_OTEN_IDP_AUTH_DOMAIN,
  client_id: import.meta.env.VITE_OTEN_IDP_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
  post_logout_redirect_uri:
    import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI || window.location.origin,
  scope: "openid profile email",
};
```

## 📂 Project Structure

```
oten-auth-react/
├── src/
│   ├── components/
│   │   ├── LoginButton.tsx      # Login button component
│   │   ├── LogoutButton.tsx     # Logout button component
│   │   └── Profile.tsx          # User profile display
│   ├── hooks/
│   │   └── use-auth.tsx         # Custom hook for auth context
│   ├── providers/
│   │   └── auth-provider.tsx    # Auth context provider
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # App entry point
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
┌─────────┐                                  ┌──────────────┐
│  User   │                                  │  Oten IDP    │
└────┬────┘                                  └──────┬───────┘
     │                                              │
     │  1. Click "Log In"                          │
     ├─────────────────────────────────────────────>
     │                                              │
     │  2. Redirect to /authorize (with PKCE)      │
     │<─────────────────────────────────────────────┤
     │                                              │
     │  3. Enter credentials                        │
     ├─────────────────────────────────────────────>
     │                                              │
     │  4. Redirect back with auth code             │
     │<─────────────────────────────────────────────┤
     │                                              │
     │  5. Exchange code for tokens                 │
     ├─────────────────────────────────────────────>
     │                                              │
     │  6. Return access_token & id_token           │
     │<─────────────────────────────────────────────┤
     │                                              │
     │  7. Store tokens & show profile              │
     │                                              │
```

### Key Components

#### **AuthProvider** (`src/providers/auth-provider.tsx`)

The core authentication provider that:

- Manages user authentication state
- Handles login/logout flows
- Processes OAuth callbacks
- Manages token lifecycle
- Handles authentication errors

#### **useAuth Hook** (`src/hooks/use-auth.tsx`)

A custom React hook that provides access to:

```typescript
const {
  user, // Current user object (null if not authenticated)
  isAuthenticated, // Boolean authentication status
  isLoading, // Loading state during initialization
  token, // Access token for API calls
  error, // Authentication errors
  loginWithRedirect, // Function to initiate login
  logoutWithRedirect, // Function to initiate logout
  clearError, // Function to clear error state
} = useAuth();
```

#### **Components**

- **LoginButton** - Triggers the OAuth login flow
- **LogoutButton** - Logs out the user and clears session
- **Profile** - Displays authenticated user information

### Event Handlers

The application handles the following OIDC events:

- **`UserLoaded`** - Fires when user is successfully authenticated
- **`AccessTokenExpired`** - Fires when the access token expires
- **`SilentRenewError`** - Fires when automatic token renewal fails

## 📚 API Reference

### useAuth() Hook

```typescript
import { useAuth } from "./hooks/use-auth";

function MyComponent() {
  const { isAuthenticated, user, loginWithRedirect } = useAuth();

  // Use authentication state and methods
}
```

#### Return Values

| Property             | Type                  | Description                       |
| -------------------- | --------------------- | --------------------------------- |
| `user`               | `User \| null`        | Current authenticated user object |
| `isAuthenticated`    | `boolean`             | Whether user is authenticated     |
| `isLoading`          | `boolean`             | Whether auth is initializing      |
| `token`              | `string \| null`      | Access token for API calls        |
| `error`              | `Error \| undefined`  | Any authentication error          |
| `loginWithRedirect`  | `() => Promise<void>` | Initiates login flow              |
| `logoutWithRedirect` | `() => Promise<void>` | Initiates logout flow             |
| `clearError`         | `() => void`          | Clears error state                |

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
  const { token, isAuthenticated } = useAuth();

  const fetchProtectedData = async () => {
    if (!isAuthenticated || !token) return;

    const response = await fetch("https://api.example.com/protected", {
      headers: {
        Authorization: `Bearer ${token}`,
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

**Problem**: The redirect URI doesn't match what's configured in Oten IDP.

**Solution**:

- Verify `VITE_REDIRECT_URI` matches exactly what's in your Oten IDP dashboard
- Include the protocol (`http://` or `https://`)
- Don't include trailing slashes unless configured that way
- For development, use `http://localhost:5173`

#### **"Invalid Client" Error**

**Problem**: Client ID is incorrect or client is not configured properly.

**Solution**:

- Double-check `VITE_OTEN_IDP_CLIENT_ID` in your `.env` file
- Ensure the client is enabled in Oten IDP dashboard
- Verify the client is configured for Authorization Code Flow

#### **Session Lost on Page Refresh**

**Problem**: User is logged out when refreshing the page.

**Solution**:

- Check browser console for localStorage errors
- Verify localStorage is enabled in browser settings
- Ensure cookies are enabled (required for OIDC)
- Check that your domain is not blocking third-party cookies

#### **CORS Errors**

**Problem**: Browser blocks requests to Oten IDP.

**Solution**:

- Ensure `http://localhost:5173` is added to Allowed Web Origins in Oten IDP
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

✅ **Authorization Code Flow with PKCE** - Most secure OAuth flow for SPAs
✅ **State Parameter** - CSRF protection (handled by oidc-client-ts)
✅ **Nonce Validation** - Replay attack protection (handled by oidc-client-ts)
✅ **Token Storage** - Tokens stored in sessionStorage (consider httpOnly cookies for production)
✅ **HTTPS Required** - Always use HTTPS in production
✅ **Error Handling** - Comprehensive error handling and user feedback

### Production Recommendations

1. **Use HTTPS** - Always serve your app over HTTPS in production
2. **Environment Variables** - Never commit `.env` to version control
3. **Content Security Policy** - Add CSP headers to prevent XSS attacks
4. **Token Rotation** - Implement refresh token rotation if supported by your IDP
5. **Session Monitoring** - Track and monitor active user sessions
6. **Rate Limiting** - Implement rate limiting on authentication endpoints
7. **Audit Logging** - Log authentication events for security monitoring

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
- **GitHub Issues**: [GitHub Issues](https://github.com/your-repo/issues)

---

**Built with ❤️ using React, TypeScript, and Oten IDP**
