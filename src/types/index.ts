export type UserRole = "recruiter" | "candidate"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface Job {
  id: string
  title: string
  description: string
  requiredSkills: string[]
  experienceYears: number
  educationLevel: string
  createdBy?: string
  createdAt?: string
}

export interface ScoreBreakdownDimension {
  score: number
  maxScore: number
  explanations: string[]
}

export interface ScoreBreakdown {
  skillsMatch?: ScoreBreakdownDimension
  experience?: ScoreBreakdownDimension
  education?: ScoreBreakdownDimension
  titleRelevance?: ScoreBreakdownDimension
}

export interface Application {
  id: string
  jobId: string
  job?: Job
  candidateId: string
  candidate?: {
    id: string
    name: string
    email: string
    phone?: string
  }
  totalScore: number | null
  breakdown?: ScoreBreakdown
  message?: string
  createdAt?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface LoginPayload {
  email: string
  password: string
}

export interface CreateJobPayload {
  title: string
  description: string
  requiredSkills: string[]
  experienceYears: number
  educationLevel: string
}
