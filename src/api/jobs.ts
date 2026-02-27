import { api } from "./client"
import type { Job } from "@/types"
import type { CreateJobPayload } from "@/types"

export async function listJobs(): Promise<Job[]> {
  const { data } = await api.get<Job[]>("/api/jobs")
  return data
}

export async function getJob(id: string): Promise<Job> {
  const { data } = await api.get<Job>(`/api/jobs/${id}`)
  return data
}

export async function createJob(payload: CreateJobPayload): Promise<Job> {
  const { data } = await api.post<Job>("/api/jobs", payload)
  return data
}

export async function getMyPostedJobs(): Promise<Job[]> {
  const { data } = await api.get<Job[]>("/api/jobs/me/posted")
  return data
}
