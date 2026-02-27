import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Briefcase, MapPin, GraduationCap } from "lucide-react"
import { listJobs } from "@/api/jobs"
import type { Job } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    listJobs()
      .then(setJobs)
      .catch(() => setError("Failed to load jobs"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Loading jobs...</p>
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

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-16 text-center">
        <Briefcase className="mx-auto h-14 w-14 text-muted-foreground/50" />
        <h2 className="mt-4 text-lg font-semibold">No open jobs</h2>
        <p className="mt-1 text-muted-foreground">Check back soon for new opportunities.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Open Jobs</h1>
        <p className="mt-1 text-muted-foreground">Browse and apply to positions that match your skills.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-1">
        {jobs.map((job) => (
          <Link key={job.id} to={`/jobs/${job.id}`} className="block group">
            <Card className="overflow-hidden border border-border/60 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20 group-hover:translate-y-[-2px]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {job.title}
                    </CardTitle>
                    <CardDescription className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.experienceYears} years exp
                      </span>
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5" />
                        {job.educationLevel}
                      </span>
                    </CardDescription>
                  </div>
                  <Button size="sm" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    View job
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {job.description}
                </p>
                {job.requiredSkills?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.requiredSkills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 5 && (
                      <span className="text-xs text-muted-foreground">
                        +{job.requiredSkills.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
