import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { createJob } from "@/api/jobs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CreateJob() {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [skillsInput, setSkillsInput] = useState("")
  const [experienceYears, setExperienceYears] = useState("")
  const [educationLevel, setEducationLevel] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    if (skills.length === 0) {
      setError("At least one skill is required")
      return
    }
    const years = parseInt(experienceYears, 10)
    if (isNaN(years) || years < 0) {
      setError("Experience years must be a valid number")
      return
    }
    setLoading(true)
    try {
      const job = await createJob({
        title,
        description,
        requiredSkills: skills,
        experienceYears: years,
        educationLevel: educationLevel || "Any",
      })
      navigate(`/jobs/${job.id}/applications`, { replace: true })
    } catch (err: unknown) {
      let msg = "Failed to create job"
      if (err && typeof err === "object" && "response" in err) {
        const res = (err as { response?: { data?: unknown } }).response?.data
        if (res && typeof res === "object" && "errors" in res) {
          const errors = (res as { errors?: Array<{ msg?: string }> }).errors
          if (Array.isArray(errors) && errors.length > 0) {
            msg = errors.map((e) => e.msg).filter(Boolean).join(". ") || msg
          }
        } else if (res && typeof res === "object" && "message" in res) {
          msg = String((res as { message?: string }).message ?? msg)
        }
      }
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Job Posting</h1>
        <p className="mt-1 text-muted-foreground">Define the role and requirements for rule-based ATS matching.</p>
      </div>

      <Card className="overflow-hidden border border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Job Details</CardTitle>
          <CardDescription>
            Fill in the job requirements. These will be used for rule-based candidate matching.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3">
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-medium">Job Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior React Developer"
                required
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="font-medium">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Job description..."
                required
                rows={5}
                className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experience" className="font-medium">Experience (years)</Label>
                <Input
                  id="experience"
                  type="number"
                  min={0}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  placeholder="e.g. 3"
                  required
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education" className="font-medium">Education Level</Label>
                <Input
                  id="education"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  placeholder="e.g. Bachelor's, Any"
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills" className="font-medium">Required Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. React, TypeScript, Node.js"
                className="rounded-lg"
              />
            </div>
            <Button type="submit" disabled={loading} size="lg" className="rounded-lg mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Creating...
                </span>
              ) : (
                "Create Job"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
