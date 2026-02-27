import { api } from "./client"
import type { Application, ScoreBreakdown } from "@/types"

/** Map backend score_breakdown to frontend ScoreBreakdown */
function mapBreakdown(raw: unknown): ScoreBreakdown | undefined {
  if (!raw || typeof raw !== "object") return undefined
  const top = raw as Record<string, unknown>
  // Backend: { breakdown: { skills, experience, ... }, explanation: [skills, exp, edu, title] }
  const b = (top.breakdown ?? top) as Record<string, unknown>
  const allExplanations = Array.isArray(top.explanation)
    ? top.explanation.map(String)
    : []
  const toDim = (key: string, explanationIndex: number) => {
    const d = b[key]
    if (!d || typeof d !== "object") return undefined
    const dim = d as Record<string, unknown>
    const score = Number(dim.score ?? 0)
    const max = Number(dim.max ?? dim.maxScore ?? 0)
    const explanation = allExplanations[explanationIndex]
    return {
      score,
      maxScore: max,
      explanations: Array.isArray(dim.explanations)
        ? dim.explanations.map(String)
        : explanation ? [explanation] : [],
    }
  }
  const skillsMatch = toDim("skills", 0) ?? toDim("skillsMatch", 0)
  const experience = toDim("experience", 1)
  const education = toDim("education", 2)
  const titleRelevance =
    toDim("job_title_relevance", 3) ?? toDim("titleRelevance", 3)
  if (!skillsMatch && !experience && !education && !titleRelevance)
    return undefined
  return {
    skillsMatch,
    experience,
    education,
    titleRelevance,
  }
}

/** Transform backend application to frontend Application */
function fromBackendApplication(
  raw: Record<string, unknown>,
  options?: { jobId?: string; jobTitle?: string }
): Application {
  const jobId = options?.jobId ?? raw.job_id
  const jobTitle = options?.jobTitle ?? raw.job_title
  const breakdown = mapBreakdown(raw.score_breakdown)
  return {
    id: String(raw.id ?? raw.application_id),
    jobId: String(jobId ?? raw.job_id ?? ""),
    job: jobTitle
      ? { id: "", title: String(jobTitle), description: "", requiredSkills: [], experienceYears: 0, educationLevel: "" }
      : undefined,
    candidateId: String(raw.candidate_id ?? ""),
    candidate:
      raw.candidate_name != null || raw.candidate_email != null
        ? {
            id: String(raw.candidate_id ?? ""),
            name: String(raw.candidate_name ?? ""),
            email: String(raw.candidate_email ?? ""),
          }
        : undefined,
    totalScore:
      raw.ats_score != null ? parseFloat(String(raw.ats_score)) : null,
    breakdown,
    message: (() => {
      const sb = raw.score_breakdown
      if (!sb || typeof sb !== "object") return undefined
      const expl = (sb as Record<string, unknown>).explanation
      if (typeof expl === "string") return expl
      if (Array.isArray(expl) && expl.length > 0)
        return expl.map(String).join(". ")
      return undefined
    })(),
    createdAt:
      typeof raw.created_at === "string"
        ? raw.created_at
        : typeof raw.applied_at === "string"
          ? raw.applied_at
          : undefined,
  }
}

export async function apply(jobId: string, file: File): Promise<Application> {
  const formData = new FormData()
  formData.append("resume", file)
  const { data } = await api.post<{ application?: Record<string, unknown> }>(
    `/api/applications/jobs/${jobId}/apply`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
  const app = data?.application ?? data
  return fromBackendApplication(
    typeof app === "object" && app !== null ? app as Record<string, unknown> : {},
    { jobId }
  )
}

export async function getMyApplications(): Promise<Application[]> {
  const { data } = await api.get<Record<string, unknown>[]>("/api/applications/me")
  return (Array.isArray(data) ? data : []).map((row) =>
    fromBackendApplication(row, { jobTitle: row.job_title as string })
  )
}

export async function getJobApplications(
  jobId: string
): Promise<Application[]> {
  const { data } = await api.get<{
    job_title?: string
    candidates?: Record<string, unknown>[]
  }>(`/api/applications/jobs/${jobId}/applications`)
  const candidates = data?.candidates ?? []
  return candidates.map((c) =>
    fromBackendApplication(
      {
        ...c,
        id: c.application_id,
        job_id: jobId,
        ats_score: c.ats_score,
        score_breakdown: c.score_breakdown,
        created_at: c.applied_at,
        candidate_name: c.candidate_name,
        candidate_email: c.candidate_email,
      } as Record<string, unknown>,
      { jobId, jobTitle: data?.job_title }
    )
  )
}

export async function getApplication(id: string): Promise<Application> {
  const { data } = await api.get<Record<string, unknown>>(
    `/api/applications/${id}`
  )
  return fromBackendApplication(data ?? {}, {
    jobTitle: data?.job_title as string,
  })
}
