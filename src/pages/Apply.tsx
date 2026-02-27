import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, FileUp } from "lucide-react"
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
      let msg = "Failed to apply"
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: unknown } }).response?.data
        if (res && typeof res === "object") {
          msg =
            String((res as { error?: string }).error ??
              (res as { message?: string }).message ?? msg)
        }
      }
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error && !job) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="font-medium text-destructive">{error}</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="font-medium text-destructive">Job not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-lg">
      <Link
        to={`/jobs/${id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to job
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Apply for {job.title}</h1>
        <p className="mt-1 text-muted-foreground">Upload your resume and we&apos;ll score it with our ATS.</p>
      </div>

      <Card className="overflow-hidden border border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Upload Resume</CardTitle>
          <CardDescription>
            PDF only. We parse skills, experience, and education for transparent rule-based scoring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3">
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            )}
            <label
              htmlFor="resume"
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors cursor-pointer ${
                file ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <FileUp className={`h-12 w-12 mb-3 ${file ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">
                {file ? file.name : "Click or drop PDF here"}
              </span>
              <input
                id="resume"
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="sr-only"
              />
            </label>
            <Button type="submit" disabled={!file || submitting} size="lg" className="w-full rounded-lg">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Submitting...
                </span>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
