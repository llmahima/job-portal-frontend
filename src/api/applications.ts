import { api } from "./client"
import type { Application } from "@/types"

export async function apply(jobId: string, file: File): Promise<Application> {
  const formData = new FormData()
  formData.append("resume", file)
  const { data } = await api.post<Application>(
    `/api/applications/jobs/${jobId}/apply`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
  return data
}

export async function getMyApplications(): Promise<Application[]> {
  const { data } = await api.get<Application[]>("/api/applications/me")
  return data
}

export async function getJobApplications(
  jobId: string
): Promise<Application[]> {
  const { data } = await api.get<Application[]>(
    `/api/applications/jobs/${jobId}/applications`
  )
  return data
}

export async function getApplication(id: string): Promise<Application> {
  const { data } = await api.get<Application>(`/api/applications/${id}`)
  return data
}
