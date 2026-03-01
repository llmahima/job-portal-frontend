# Job Portal Frontend

This is the frontend application for the Job Portal system, built with React, TypeScript, and Vite. It provides a platform for candidates to find and apply for jobs, and for recruiters to post jobs and manage applications.

## 🏗 Architecture

### Tech Stack
- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI (Headless UI components) + custom components
- **Routing:** React Router DOM
- **State Management:** React Context (AuthContext)
- **Form Handling:** React Hook Form + Zod (for validation)
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Project Structure
The `src/` directory is organized as follows:

- `api/`: Contains axios client configuration and API service functions for communicating with the backend.
- `assets/`: Static assets like images or fonts.
- `components/`: 
  - `ui/`: Reusable, atomic UI components (buttons, inputs, cards, etc.).
  - `Layout.tsx` & `ProtectedRoute.tsx`: Route layout and access control wrappers.
- `contexts/`: React Contexts (e.g., `AuthContext` for managing user authentication state).
- `lib/`: Utility functions (e.g., `utils.ts` for Tailwind class merging).
- `pages/`: Top-level page components corresponding to different routes:
  - `JobList`: Discover available jobs.
  - `JobDetail`: View details of a specific job.
  - `Apply`: Form for candidates to apply to a job.
  - `CreateJob`: Form for recruiters to post new jobs.
  - `Dashboard`: User dashboard (differentiated by role).
  - `JobApplications`: Recruiter view of applications for a job.
  - `ApplicationDetail`: Detailed view of a specific application.
  - `Login` & `Register`: Authentication pages.
- `types/`: Global TypeScript interfaces and types for the application payload and states.

## 🚀 Implementation Details

### Authentication & Authorization
Authentication is handled using JWT (JSON Web Tokens). 
- **`AuthContext`**: Manages the authentication state globally. It stores the currently logged-in user and token, and provides `login` and `logout` functions.
- **`ProtectedRoute`**: A higher-order component that wraps routes requiring authentication. It checks if a user is logged in, and optionally checks if the user has the required `role` (e.g., 'candidate' or 'recruiter') to access the page. Unauthenticated users are redirected to the login page.

### Routing
The application uses React Router for client-side routing, wrapped with the `Layout` component to provide consistent navigation (e.g., Navbar).
Routes are defined in `App.tsx` and encompass both public (JobList, JobDetail) and protected endpoints (Dashboard, Apply, CreateJob).

### API Communication
API requests are centralized using configured Axios instances in `src/api/client.ts`.
- **Interceptors**: Axios interceptors are used to automatically attach the JWT token (stored in `localStorage`) to the `Authorization` header of outgoing requests. It also handles basic request logging for debugging.

### UI & Styling
The application uses Tailwind CSS for utility-first styling. Reusable components (like Buttons, Inputs, Dialogs) are built in the `components/ui/` directory, heavily leaning on Radix UI primitives for accessibility. Forms use `react-hook-form` coupled with `zod` schema validation to provide instant, type-safe feedback to users.

## 🛠 Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup environment variables by creating a `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 🌐 Deployment
The project is configured as a Single Page Application (SPA). For platforms like Vercel, a `vercel.json` file is included in the root to rewrite all requests to `index.html` to allow React Router to handle the routing seamlessly without throwing 404 errors on deep links.
