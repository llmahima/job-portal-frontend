import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {title} ({dim.score}/{maxScore} pts)
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
    return <p className="text-muted-foreground">Loading...</p>
  }

  if (error || !app) {
    return <p className="text-destructive">{error || "Application not found"}</p>
  }

  const hasBreakdown = app.breakdown && (
    app.breakdown.skillsMatch ||
    app.breakdown.experience ||
    app.breakdown.education ||
    app.breakdown.titleRelevance
  )

  const insufficientData = app.message?.toLowerCase().includes("insufficient")

  return (
    <div className="space-y-6">
      <div>
        <Link to="/dashboard" className="text-primary hover:underline text-sm">
          ← Back to dashboard
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Application Details</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {app.job?.title ?? "Job"} — {app.candidate?.name ?? "Candidate"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Candidate</CardTitle>
          <CardDescription>
            {app.candidate?.name ?? "—"} · {app.candidate?.email ?? "—"}
            {app.candidate?.phone && ` · ${app.candidate.phone}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">
            Total Score: {app.totalScore != null ? `${app.totalScore}/100` : "N/A"}
          </p>
          {insufficientData && (
            <p className="mt-2 text-destructive text-sm">{app.message}</p>
          )}
        </CardContent>
      </Card>

      {insufficientData && !hasBreakdown ? (
        <p className="text-muted-foreground">{app.message}</p>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Score Breakdown</h2>
          <p className="text-sm text-muted-foreground">
            ATS scoring: Skills match (40pts), Experience (30pts), Education
            (15pts), Job title relevance (15pts)
          </p>
          <div className="grid gap-4 md:grid-cols-2">
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
