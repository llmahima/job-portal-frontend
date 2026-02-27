import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
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
      const msg = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Failed to create job"
        : "Failed to create job"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link to="/dashboard" className="text-primary hover:underline text-sm">
          ← Back to dashboard
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Create Job Posting</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Fill in the job requirements. These will be used for rule-based
            candidate matching.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior React Developer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Job description..."
                required
                rows={5}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. React, TypeScript, Node.js"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (years)</Label>
              <Input
                id="experience"
                type="number"
                min={0}
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="e.g. 3"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="education">Education Level</Label>
              <Input
                id="education"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                placeholder="e.g. Bachelor's, Master's, Any"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Job"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
