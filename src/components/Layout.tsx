import { Link, useNavigate } from "react-router-dom"
import { Briefcase, LayoutDashboard, PlusCircle, LogOut, User } from "lucide-react"
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="h-4 w-4" />
            </div>
            Job Portal
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              Jobs
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                {user.role === "recruiter" && (
                  <Link
                    to="/jobs/new"
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Post Job
                  </Link>
                )}
                <div className="ml-2 flex items-center gap-2 pl-2 border-l border-border">
                  <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/80">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">({user.role})</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-lg">Get started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-1 max-w-4xl">
        {children}
      </main>
    </div>
  )
}
