import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { getMyApplications } from "@/api/applications"
import { getMyPostedJobs } from "@/api/jobs"
import type { Application } from "@/types"
import type { Job } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText, PlusCircle, ArrowRight } from "lucide-react"

function ScoreRing({ score }: { score: number | null }) {
  const pct = score != null ? Math.min(100, Math.round(score)) : 0
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const stroke = (pct / 100) * circumference
  const color = pct >= 70 ? "stroke-emerald-500" : pct >= 50 ? "stroke-amber-500" : "stroke-muted-foreground"
  return (
    <div className="relative h-12 w-12">
      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/50" />
        <circle cx="24" cy="24" r={radius} fill="none" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={circumference - stroke} className={color} strokeLinecap="round" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
        {score != null ? pct : "—"}
      </span>
    </div>
  )
}

export function Dashboard() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) return
    if (user.role === "candidate") {
      getMyApplications()
        .then(setApplications)
        .catch(() => setError("Failed to load applications"))
        .finally(() => setLoading(false))
    } else {
      getMyPostedJobs()
        .then(setJobs)
        .catch(() => setError("Failed to load jobs"))
        .finally(() => setLoading(false))
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="font-medium text-destructive">{error}</p>
      </div>
    )
  }

  if (user?.role === "candidate") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
          <p className="mt-1 text-muted-foreground">Track your job applications and ATS scores.</p>
        </div>
        {applications.length === 0 ? (
          <Card className="overflow-hidden border border-dashed border-border">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-14 w-14 text-muted-foreground/50" />
              <h2 className="mt-4 text-lg font-semibold">No applications yet</h2>
              <p className="mt-1 text-center text-muted-foreground max-w-sm">Browse open jobs and apply with your resume to see your ATS score here.</p>
              <Link to="/" className="mt-6">
                <Button>Browse jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Link key={app.id} to={`/applications/${app.id}`} className="block group">
                <Card className="overflow-hidden border border-border/60 transition-all hover:shadow-md hover:border-primary/20 group-hover:translate-y-[-2px]">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{app.job?.title ?? "Job"}</CardTitle>
                        <CardDescription className="mt-1">
                          {app.message && `${app.message} · `}
                          {app.totalScore != null ? `Score: ${app.totalScore}/100` : "N/A"}
                        </CardDescription>
                      </div>
                      <ScoreRing score={app.totalScore} />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Posted Jobs</h1>
          <p className="mt-1 text-muted-foreground">Manage your job postings and view applicants.</p>
        </div>
        <Link to="/jobs/new">
          <Button className="gap-2 rounded-lg">
            <PlusCircle className="h-4 w-4" />
            Post a new job
          </Button>
        </Link>
      </div>
      {jobs.length === 0 ? (
        <Card className="overflow-hidden border border-dashed border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-14 w-14 text-muted-foreground/50" />
            <h2 className="mt-4 text-lg font-semibold">No jobs posted</h2>
            <p className="mt-1 text-center text-muted-foreground max-w-sm">Create your first job posting to start receiving applications.</p>
            <Link to="/jobs/new" className="mt-6">
              <Button>Post a job</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Education</TableHead>
                <TableHead className="w-[120px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id} className="group">
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell className="text-muted-foreground">{job.experienceYears} years</TableCell>
                  <TableCell className="text-muted-foreground">{job.educationLevel}</TableCell>
                  <TableCell>
                    <Link to={`/jobs/${job.id}/applications`}>
                      <Button variant="ghost" size="sm" className="gap-1 text-primary">
                        View applicants
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
