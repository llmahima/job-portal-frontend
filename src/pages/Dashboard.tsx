import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { getMyApplications } from "@/api/applications"
import { getMyPostedJobs } from "@/api/jobs"
import type { Application } from "@/types"
import type { Job } from "@/types"
import {
  Card,
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
    return <p className="text-muted-foreground">Loading...</p>
  }

  if (error) {
    return <p className="text-destructive">{error}</p>
  }

  if (user?.role === "candidate") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">My Applications</h1>
        {applications.length === 0 ? (
          <p className="text-muted-foreground">You have not applied to any jobs yet.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Link key={app.id} to={`/applications/${app.id}`}>
                <Card className="hover:bg-accent/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {app.job?.title ?? "Job"}
                    </CardTitle>
                    <CardDescription>
                      Score: {app.totalScore != null ? `${app.totalScore}/100` : "N/A"}
                      {app.message && ` · ${app.message}`}
                    </CardDescription>
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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My Posted Jobs</h1>
      {jobs.length === 0 ? (
        <p className="text-muted-foreground">You have not posted any jobs yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Education</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.experienceYears} years</TableCell>
                <TableCell>{job.educationLevel}</TableCell>
                <TableCell>
                  <Link to={`/jobs/${job.id}/applications`}>
                    <span className="text-primary hover:underline text-sm">
                      View Applicants
                    </span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Link to="/jobs/new">
        <span className="text-primary hover:underline">Post a new job</span>
      </Link>
    </div>
  )
}
