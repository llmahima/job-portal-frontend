import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import type { UserRole } from "@/types"

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: UserRole[]
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, token, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <span className="text-muted-foreground">Loading...</span>
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
