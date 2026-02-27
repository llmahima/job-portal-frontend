import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/dashboard"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Login failed"
        : "Login failed"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[oklch(0.98_0.02_280)] font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-[oklch(0.7_0.2_300/0.4)] blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-[oklch(0.7_0.2_250/0.3)] blur-[100px] [animation-delay:1s] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.8_0.15_0/0.2)] blur-[80px] [animation-delay:2s] animate-pulse" />

      <Card className="relative z-10 w-full max-w-md border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl rounded-2xl mx-4">
        <CardHeader className="space-y-1 pb-4 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.2_300)] to-[oklch(0.7_0.2_250)] shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="h-6 w-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-[oklch(0.3_0.05_280)]">
            Job Portal
          </CardTitle>
          <CardDescription className="text-md font-medium text-[oklch(0.5_0.05_280)]">
            Welcome back! Please sign in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3">
                <p className="text-center text-sm font-medium text-destructive">
                  {error}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-[oklch(0.4_0.05_280)]"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-11 border-white/50 bg-white/50 focus-visible:ring-[oklch(0.7_0.2_300)]/30 backdrop-blur-sm transition-all focus:border-[oklch(0.7_0.2_300)]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-[oklch(0.4_0.05_280)]"
                >
                  Password
                </Label>
                <Link
                  to="#"
                  className="text-xs font-medium text-[oklch(0.6_0.2_280)] hover:underline shadow-none"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="h-11 border-white/50 bg-white/50 focus-visible:ring-[oklch(0.7_0.2_300)]/30 backdrop-blur-sm transition-all focus:border-[oklch(0.7_0.2_300)]"
              />
            </div>
            <Button
              type="submit"
              className="h-11 w-full bg-gradient-to-r from-[oklch(0.7_0.2_300)] via-[oklch(0.65_0.2_280)] to-[oklch(0.7_0.2_250)] text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[oklch(0.9_0.02_280)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-[oklch(0.5_0.05_280)]">
                  Or continue with
                </span>
              </div>
            </div>
            <p className="text-center text-sm font-medium text-[oklch(0.5_0.1_280)]">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-[oklch(0.6_0.2_300)] hover:underline decoration-2 transition-all"
              >
                Create an account
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
