import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, User } from "lucide-react"
import { getApplication } from "@/api/applications"
import type { Application, ScoreBreakdownDimension } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function DimensionBlock({
  title,
  maxScore,
  dim,
}: {
  title: string
  maxScore: number
  dim?: ScoreBreakdownDimension | null
}) {
  if (!dim) return null
  return (
    <Card className="overflow-hidden border border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          {title}
          <span className="text-muted-foreground font-normal">{dim.score}/{maxScore}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dim.explanations?.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {dim.explanations.map((exp, i) => (
              <li key={i}>{exp}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No details</p>
        )}
      </CardContent>
    </Card>
  )
}

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>()
  const [app, setApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    getApplication(id)
      .then(setApp)
      .catch(() => setError("Failed to load application"))
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

  if (error || !app) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <p className="font-medium text-destructive">{error || "Application not found"}</p>
      </div>
    )
  }

  const hasBreakdown = app.breakdown && (
    app.breakdown.skillsMatch ||
    app.breakdown.experience ||
    app.breakdown.education ||
    app.breakdown.titleRelevance
  )

  const insufficientData = app.message?.toLowerCase().includes("insufficient")

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
        <h1 className="text-3xl font-bold tracking-tight">Application Details</h1>
        <p className="mt-1 text-muted-foreground">
          {app.job?.title ?? "Job"} — {app.candidate?.name ?? "Candidate"}
        </p>
      </div>

      <Card className="overflow-hidden border border-border/60">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Candidate
          </CardTitle>
          <CardDescription>
            {app.candidate?.name ?? "—"} · {app.candidate?.email ?? "—"}
            {app.candidate?.phone && ` · ${app.candidate.phone}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
              {app.totalScore != null ? Math.round(app.totalScore) : "—"}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ATS Score</p>
              <p className="text-2xl font-bold">{app.totalScore != null ? `${app.totalScore}/100` : "N/A"}</p>
            </div>
          </div>
          {insufficientData && (
            <p className="text-destructive text-sm rounded-lg bg-destructive/10 p-3">{app.message}</p>
          )}
        </CardContent>
      </Card>

      {insufficientData && !hasBreakdown ? (
        <p className="text-muted-foreground rounded-lg bg-muted/50 p-4">{app.message}</p>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Score Breakdown</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Rule-based ATS: Skills (40), Experience (30), Education (15), Title relevance (15)
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <DimensionBlock
              title="Skills Match"
              maxScore={40}
              dim={app.breakdown?.skillsMatch}
            />
            <DimensionBlock
              title="Experience"
              maxScore={30}
              dim={app.breakdown?.experience}
            />
            <DimensionBlock
              title="Education"
              maxScore={15}
              dim={app.breakdown?.education}
            />
            <DimensionBlock
              title="Job Title Relevance"
              maxScore={15}
              dim={app.breakdown?.titleRelevance}
            />
          </div>
        </div>
      )}
    </div>
  )
}
