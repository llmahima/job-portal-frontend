import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
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
    return <p className="text-muted-foreground">Loading...</p>
  }

  if (error || !job) {
    return <p className="text-destructive">{error || "Job not found"}</p>
  }

  const canApply = user?.role === "candidate"

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{job.title}</h1>
          <p className="text-muted-foreground">
            {job.experienceYears} years experience · {job.educationLevel}
          </p>
        </div>
        {canApply && (
          <Link to={`/jobs/${id}/apply`}>
            <Button>Apply</Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{job.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
          <CardDescription>Required skills and qualifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Experience:</strong> {job.experienceYears} years
          </p>
          <p>
            <strong>Education:</strong> {job.educationLevel}
          </p>
          {job.requiredSkills?.length > 0 && (
            <p>
              <strong>Skills:</strong> {job.requiredSkills.join(", ")}
            </p>
          )}
        </CardContent>
      </Card>

      {canApply && (
        <Link to={`/jobs/${id}/apply`}>
          <Button>Apply for this job</Button>
        </Link>
      )}
    </div>
  )
}
