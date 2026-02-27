import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getJob } from "@/api/jobs"
import { getJobApplications } from "@/api/applications"
import type { Job } from "@/types"
import type { Application } from "@/types"
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

export function JobApplications() {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<Job | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    Promise.all([getJob(id), getJobApplications(id)])
      .then(([j, apps]) => {
        setJob(j)
        setApplications(apps)
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  if (error || !job) {
    return <p className="text-destructive">{error || "Job not found"}</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/dashboard" className="text-primary hover:underline text-sm">
          ← Back to dashboard
        </Link>
        <h1 className="text-2xl font-semibold mt-2">
          Applicants for {job.title}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Ranked by ATS score (Skills 40pts, Experience 30pts, Education 15pts, Title 15pts)
        </p>
      </div>

      {applications.length === 0 ? (
        <p className="text-muted-foreground">No applications yet.</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Ranked Candidates</CardTitle>
            <CardDescription>
              Click on a candidate to see the full score breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app, idx) => (
                  <TableRow key={app.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>
                      {app.candidate?.name ?? "—"}
                    </TableCell>
                    <TableCell>
                      {app.candidate?.email ?? "—"}
                    </TableCell>
                    <TableCell>
                      {app.totalScore != null ? `${app.totalScore}/100` : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Link to={`/applications/${app.id}`}>
                        <span className="text-primary hover:underline text-sm">
                          View Breakdown
                        </span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
