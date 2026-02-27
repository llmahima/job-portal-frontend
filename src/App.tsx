import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { Layout } from "@/components/Layout"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { JobList } from "@/pages/JobList"
import { JobDetail } from "@/pages/JobDetail"
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"
import { Dashboard } from "@/pages/Dashboard"
import { Apply } from "@/pages/Apply"
import { CreateJob } from "@/pages/CreateJob"
import { JobApplications } from "@/pages/JobApplications"
import { ApplicationDetail } from "@/pages/ApplicationDetail"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:id/apply"
              element={
                <ProtectedRoute roles={["candidate"]}>
                  <Apply />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/new"
              element={
                <ProtectedRoute roles={["recruiter"]}>
                  <CreateJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/:id/applications"
              element={
                <ProtectedRoute roles={["recruiter"]}>
                  <JobApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications/:id"
              element={
                <ProtectedRoute>
                  <ApplicationDetail />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
