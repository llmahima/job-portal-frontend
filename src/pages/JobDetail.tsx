import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Briefcase, GraduationCap } from "lucide-react"
import { getJob } from "@/api/jobs"
import { useAuth } from "@/contexts/AuthContext"
import type { Job } from "@/types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    getJob(id)
      .then(setJob)
      .catch(() => setError("Failed to load job"))
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

  const canApply = user?.role === "candidate"

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {job.experienceYears} years experience
            </span>
            <span className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              {job.educationLevel}
            </span>
          </div>
        </div>
        {canApply && (
          <Link to={`/jobs/${id}/apply`} className="shrink-0">
            <Button size="lg" className="rounded-lg">
              Apply now
            </Button>
          </Link>
        )}
      </div>

      <Card className="overflow-hidden border border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {job.description}
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Requirements</CardTitle>
          <CardDescription>Skills and qualifications for this role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Experience</p>
              <p className="mt-1 font-semibold">{job.experienceYears} years</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Education</p>
              <p className="mt-1 font-semibold">{job.educationLevel}</p>
            </div>
          </div>
          {job.requiredSkills?.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Required skills</p>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {canApply && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="font-medium">Ready to apply?</p>
          <p className="mt-1 text-sm text-muted-foreground">Upload your resume and we&apos;ll score it against this job.</p>
          <Link to={`/jobs/${id}/apply`} className="mt-4 inline-block">
            <Button size="lg" className="rounded-lg">Apply for this job</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
