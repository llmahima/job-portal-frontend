import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { UserRole } from "@/types"

export function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("candidate")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await register(name, email, password, role)
      navigate("/dashboard", { replace: true })
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Registration failed"
        : "Registration failed"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[oklch(0.98_0.02_280)] font-sans p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-[oklch(0.7_0.2_300/0.4)] blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-[oklch(0.7_0.2_250/0.3)] blur-[100px] [animation-delay:1s] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.8_0.15_0/0.2)] blur-[80px] [animation-delay:2s] animate-pulse" />

      <Card className="relative z-10 w-full max-w-md border-white/40 bg-white/70 shadow-2xl backdrop-blur-xl rounded-2xl">
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
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-[oklch(0.3_0.05_280)]">
            Create Account
          </CardTitle>
          <CardDescription className="text-md font-medium text-[oklch(0.5_0.05_280)]">
            Join us today as a recruiter or candidate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3">
                <p className="text-center text-sm font-medium text-destructive">
                  {error}
                </p>
              </div>
            )}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-[oklch(0.4_0.05_280)]"
              >
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="h-10 border-white/50 bg-white/50 focus-visible:ring-[oklch(0.7_0.2_300)]/30 backdrop-blur-sm transition-all focus:border-[oklch(0.7_0.2_300)]"
              />
            </div>
            <div className="space-y-1.5">
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
                className="h-10 border-white/50 bg-white/50 focus-visible:ring-[oklch(0.7_0.2_300)]/30 backdrop-blur-sm transition-all focus:border-[oklch(0.7_0.2_300)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-[oklch(0.4_0.05_280)]"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="h-10 border-white/50 bg-white/50 focus-visible:ring-[oklch(0.7_0.2_300)]/30 backdrop-blur-sm transition-all focus:border-[oklch(0.7_0.2_300)]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-[oklch(0.4_0.05_280)]">
                  Role
                </Label>
                <Select
                  value={role}
                  onValueChange={(v) => setRole(v as UserRole)}
                >
                  <SelectTrigger className="h-10 border-white/50 bg-white/50 focus:ring-[oklch(0.7_0.2_300)]/30 backdrop-blur-sm transition-all">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/90 backdrop-blur-xl">
                    <SelectItem value="candidate">Candidate</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="submit"
              className="mt-2 h-11 w-full bg-gradient-to-r from-[oklch(0.7_0.2_300)] via-[oklch(0.65_0.2_280)] to-[oklch(0.7_0.2_250)] text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
            <p className="text-center text-sm font-medium text-[oklch(0.5_0.1_280)]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[oklch(0.6_0.2_300)] hover:underline decoration-2 transition-all"
              >
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
