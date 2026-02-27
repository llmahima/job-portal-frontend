import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { listJobs } from "@/api/jobs"
import type { Job } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
    return <p className="text-muted-foreground">Loading jobs...</p>
  }

  if (error) {
    return <p className="text-destructive">{error}</p>
  }

  if (jobs.length === 0) {
    return (
      <p className="text-muted-foreground">No open jobs at the moment.</p>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Open Jobs</h1>
      <div className="space-y-4">
        {jobs.map((job) => (
          <Link key={job.id} to={`/jobs/${job.id}`}>
            <Card className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>
                  {job.experienceYears} years exp · {job.educationLevel}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {job.description}
                </p>
                {job.requiredSkills?.length > 0 && (
                  <p className="mt-2 text-sm">
                    Skills: {job.requiredSkills.join(", ")}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
