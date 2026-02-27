import { api } from "./client"
import type { Job } from "@/types"
import type { CreateJobPayload } from "@/types"

/** Backend uses snake_case; transform payload for createJob */
function toBackendJobPayload(payload: CreateJobPayload) {
  return {
    title: payload.title,
    description: payload.description,
    required_skills: payload.requiredSkills,
    min_experience: payload.experienceYears,
    education_level: payload.educationLevel,
  }
}

/** Backend returns snake_case; transform to frontend camelCase */
function fromBackendJob(raw: Record<string, unknown>): Job {
  return {
    id: String(raw.id),
    title: String(raw.title),
    description: String(raw.description),
    requiredSkills: Array.isArray(raw.required_skills)
      ? raw.required_skills.map(String)
      : [],
    experienceYears: Number(raw.min_experience ?? 0),
    educationLevel: String(raw.education_level ?? "Any"),
    createdBy: raw.recruiter_id != null ? String(raw.recruiter_id) : undefined,
    createdAt:
      typeof raw.created_at === "string" ? raw.created_at : undefined,
  }
}

export async function listJobs(): Promise<Job[]> {
  const { data } = await api.get<Record<string, unknown>[]>("/api/jobs")
  return (Array.isArray(data) ? data : []).map(fromBackendJob)
}

export async function getJob(id: string): Promise<Job> {
  const { data } = await api.get<Record<string, unknown>>(`/api/jobs/${id}`)
  return fromBackendJob(data ?? {})
}

export async function createJob(payload: CreateJobPayload): Promise<Job> {
  const { data } = await api.post<Record<string, unknown>>(
    "/api/jobs",
    toBackendJobPayload(payload)
  )
  return fromBackendJob(data ?? {})
}

export async function getMyPostedJobs(): Promise<Job[]> {
  const { data } = await api.get<Record<string, unknown>[]>(
    "/api/jobs/me/posted"
  )
  return (Array.isArray(data) ? data : []).map(fromBackendJob)
}
