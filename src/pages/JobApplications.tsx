import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, ArrowRight, Trophy } from "lucide-react"
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
import { Button } from "@/components/ui/button"

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
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="font-medium text-destructive">{error || "Job not found"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applicants for {job.title}</h1>
        <p className="mt-1 text-muted-foreground">
          Ranked by ATS score · Skills 40 · Experience 30 · Education 15 · Title 15
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="overflow-hidden border border-dashed border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Trophy className="h-14 w-14 text-muted-foreground/50" />
            <h2 className="mt-4 text-lg font-semibold">No applications yet</h2>
            <p className="mt-1 text-center text-muted-foreground max-w-sm">Candidates will appear here once they apply.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border border-border/60">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Ranked Candidates
            </CardTitle>
            <CardDescription>
              Click on a candidate to see the full ATS score breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-24">Score</TableHead>
                  <TableHead className="w-[120px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app, idx) => (
                  <TableRow key={app.id} className="group">
                    <TableCell>
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                        idx === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400" :
                        idx === 1 ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300" :
                        idx === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {idx + 1}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{app.candidate?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{app.candidate?.email ?? "—"}</TableCell>
                    <TableCell>
                      <span className="font-semibold tabular-nums">
                        {app.totalScore != null ? `${Math.round(app.totalScore)}/100` : "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link to={`/applications/${app.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1 text-primary">
                          View
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
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
