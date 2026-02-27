import { api } from "./client"
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types"

export async function register(data: RegisterPayload): Promise<AuthResponse> {
  const { data: res } = await api.post<AuthResponse>("/api/auth/register", data)
  return res
}

export async function login(data: LoginPayload): Promise<AuthResponse> {
  const { data: res } = await api.post<AuthResponse>("/api/auth/login", data)
  return res
}
