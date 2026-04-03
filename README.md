# Dashboard

A React dashboard with authentication, forced password change, user profile, and role-based access control (RBAC).

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **MUI v7** (Material UI components)
- **React Router v7** (client-side routing)
- **Axios** (HTTP client with Bearer token interceptor)

## Features

- **Login** — authenticates via `POST /api/v1/auth/login`, stores JWT token
- **Force Password Change** — if the server returns `forcePasswordChange: true`, the user is redirected to Change Password before accessing the app
- **Change Password** — available as a forced redirect and also inside the User Profile; logs the user out on success
- **Home Page** — dummy landing page after login
- **User Profile** — displays user info, inline Change Password form, and an RBAC-gated "User Authorization" section (admin-only)
- **RBAC** — the "User Authorization" settings section is hidden for non-admin roles (`SUPER_ADMIN`, `TENANT_ADMIN`, and `WMS_ADMIN` can see it)
- **Mandatory Headers** — every request includes `X-Tenant-ID`, `X-Correlation-ID` (per session), and `Idempotency-Key` (per write request)
- **Password Hashing** — passwords are SHA-256 hashed client-side before being sent in API payloads

## Project Structure

```
src/
  api/
    axiosInstance.ts        # Axios instance with Bearer token interceptor
    authApi.ts              # login() and changePassword() with mock mode support
  auth/
    AuthContext.tsx          # Auth state (token, user, role) with localStorage persistence
    ProtectedRoute.tsx      # Route guard: redirects to /login or /change-password
  components/
    AppLayout.tsx           # AppBar with navigation and profile menu
  pages/
    LoginPage.tsx           # Login form
    ChangePasswordPage.tsx  # Change password form (forced + voluntary)
    HomePage.tsx            # Dummy home page
    ProfilePage.tsx         # Profile, Change Password, and User Authorization (RBAC)
  rbac/
    roles.ts                # Role constants and isAdmin() helper
  utils/
    crypto.ts               # SHA-256 password hashing via Web Crypto API
  App.tsx                   # Router setup
  main.tsx                  # Entry point with MUI ThemeProvider
  theme.ts                  # MUI theme configuration
```

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### 1. Clone the repository

```bash
git clone https://github.com/<original-owner>/dashboard.git
cd dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

```bash
cp .env.example .env
```

Edit `.env` to configure:

```env
# Set to "true" to use mock API responses (no backend needed)
VITE_MOCK_API=true

# Base URL for the real API (used when VITE_MOCK_API is false)
VITE_API_BASE_URL=http://localhost:8080
```

### 4. Start the dev server

```bash
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173/).

With `VITE_MOCK_API=true`, you can log in with any username/password.

### 5. Build for production

```bash
npm run build
```

Output goes to the `dist/` folder.

## Push to Your Own GitHub

If you cloned this repo and want to use the code as your own fresh project (no prior git history):

```bash
# Remove the existing git history
rm -rf .git

# Initialize a fresh repo
git init

# Stage all files and create your first commit
git add .
git commit -m "Initial commit"

# Create a new repo on GitHub (via browser or gh CLI), then:
git remote add origin git@github.com:<your-username>/<your-repo-name>.git
git push -u origin main
```

## API Endpoints

| Method | Endpoint                       | Description       |
|--------|--------------------------------|-------------------|
| POST   | `/api/v1/auth/login`           | User login        |
| POST   | `/api/v1/auth/change-password` | Change password   |

### Login Request

```json
{ "username": "...", "password": "<sha256-hash>" }
```

### Login Response

```json
{
  "token": "...",
  "name": "Amministratore Sistema",
  "role": "SUPER_ADMIN",
  "tenant": "DEFAULT",
  "forcePasswordChange": false
}
```

### Change Password Request

```json
{ "oldPassword": "<sha256-hash>", "newPassword": "<sha256-hash>" }
```

## Environment Variables

| Variable            | Description                              | Default                  |
|---------------------|------------------------------------------|--------------------------|
| `VITE_MOCK_API`     | Enable mock API mode (`true` / `false`)  | `false`                  |
| `VITE_API_BASE_URL` | Backend API base URL                     | `http://localhost:8080`  |
| `VITE_TENANT_ID`    | Value for the `X-Tenant-ID` header       | `DEFAULT`                |
