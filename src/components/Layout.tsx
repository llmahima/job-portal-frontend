import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-semibold">
            Job Portal
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              Jobs
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>
                {user.role === "recruiter" && (
                  <Link
                    to="/jobs/new"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Post Job
                  </Link>
                )}
                <span className="text-sm text-muted-foreground">
                  {user.name} ({user.role})
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 flex-1 max-w-4xl">
        {children}
      </main>
    </div>
  )
}
