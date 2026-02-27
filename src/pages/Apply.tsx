import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { getJob } from "@/api/jobs"
import { apply } from "@/api/applications"
import type { Job } from "@/types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function Apply() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [job, setJob] = useState<Job | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    getJob(id)
      .then(setJob)
      .catch(() => setError("Failed to load job"))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!id || !file) {
      setError("Please select a PDF file")
      return
    }
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted")
      return
    }
    setError("")
    setSubmitting(true)
    try {
      await apply(id, file)
      navigate("/dashboard", { replace: true })
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Failed to apply"
        : "Failed to apply"
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  if (error && !job) {
    return <p className="text-destructive">{error}</p>
  }

  if (!job) {
    return <p className="text-destructive">Job not found</p>
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <Link to={`/jobs/${id}`} className="text-primary hover:underline text-sm">
          ← Back to job
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Apply for {job.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
          <CardDescription>
            Upload your resume as a PDF file. We will parse it to extract skills,
            experience, and education for scoring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="resume">PDF Resume</Label>
              <input
                id="resume"
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground file:text-sm file:font-medium"
              />
            </div>
            <Button type="submit" disabled={!file || submitting}>
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
