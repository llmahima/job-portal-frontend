import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
const DEBUG = import.meta.env.DEV || import.meta.env.VITE_LOG_API === "true"

function log(level: string, message: string, data?: object) {
  if (!DEBUG && level !== "error") return
  const time = new Date().toISOString()
  const out = level === "error" ? console.error : console.log
  out(`[API ${time}] ${level.toUpperCase()} ${message}`, data ?? "")
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  ;(config as unknown as { metadata?: { startTime: number } }).metadata = {
    startTime: Date.now(),
  }
  log("debug", `→ ${config.method?.toUpperCase()} ${config.url}`)
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => {
  const meta = (response.config as unknown as { metadata?: { startTime: number } })?.metadata
  const duration = meta?.startTime ? `${Date.now() - meta.startTime}ms` : undefined
  log("debug", `← ${response.status} ${response.config.url} ${duration ?? ""}`, {
    status: response.status,
    duration,
  })
    return response
  },
  (error) => {
    log("error", `✗ ${error.config?.url ?? "request"} failed`, {
      status: error.response?.status,
      message: error.response?.data?.error ?? error.message,
    })
    return Promise.reject(error)
  }
)
