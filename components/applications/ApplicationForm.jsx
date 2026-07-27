'use client'

// imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import posthog from 'posthog-js'

// mode: 'create' or 'edit' — controls whether this form creates or updates an application
// id: only used when mode is 'edit' — the application being edited
export default function ApplicationForm({ mode, id }) {
  // form field states
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('applied')
  const [appliedDate, setAppliedDate] = useState('')
  const [notes, setNotes] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [coverLetterFile, setCoverLetterFile] = useState(null)
  const [ existingResumeFilename, setExistingResumeFilename ] = useState(null)
  const [ existingCoverLetterFilename, setExistingCoverLetterFilename ] = useState(null)

  // UI states
  const [initialLoading, setInitialLoading] = useState(mode === 'edit')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // separate from `error` above on purpose. `error` shows an inline
  // message above a visible, working form (validation/submit failures).
  // loadError means there's no form to show at all — the application this
  // edit page needs to fetch either doesn't exist or isn't yours.
  const [loadError, setLoadError] = useState(null)

  const router = useRouter()

  // if mode is edit, fetch the existing application and pre-fill all text fields
  // file inputs are never pre-filled — browser security prevents setting file input
  // values programmatically, and existing files stay in storage untouched unless
  // the user uploads new ones
  useEffect(() => {
    async function fetchExistingApplication() {
      // skip entirely when creating a new application
      if (mode !== 'edit') return

      try {
        const response = await fetch(`/api/applications/${id}`)

        if (!response.ok) {
          setLoadError('This application could not be found.')
          return
        }

        const data = await response.json()

        // pre-fill every field with the existing values
        // optional fields default to '' if null, to avoid React controlled input warnings
        setCompanyName(data.application.company_name)
        setJobTitle(data.application.job_title)
        setJobUrl(data.application.job_url || '')
        setLocation(data.application.location || '')
        setStatus(data.application.status)
        setAppliedDate(data.application.applied_date)
        setNotes(data.application.notes || '')
        setExistingResumeFilename(data.application.resume_filename)
        setExistingCoverLetterFilename(data.application.cover_letter_filename)
      } catch (err) {
        setLoadError('Failed to load application')
      } finally {
        setInitialLoading(false)
      }
    }
    fetchExistingApplication()
  }, [mode, id])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // required field validation — same rules for create and edit
    if (!companyName || !jobTitle || !appliedDate) {
      setError('Company name, job title, and applied date are required')
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // build the multipart form data — required because files may be attached
    const formData = new FormData()
    formData.append('company_name', companyName)
    formData.append('job_title', jobTitle)
    formData.append('job_url', jobUrl)
    formData.append('location', location)
    formData.append('status', status)
    formData.append('applied_date', appliedDate)
    formData.append('notes', notes)

    // files are only appended if the user actually selected one
    // in edit mode, if left empty, existing files remain untouched by the PATCH route
    if (resumeFile) formData.append('resume', resumeFile)
    if (coverLetterFile) formData.append('cover_letter', coverLetterFile)

    // decide the endpoint and HTTP method based on mode
    // create → POST to the collection endpoint
    // edit   → PATCH to the specific application's endpoint
    const url = mode === 'edit' ? `/api/applications/${id}` : '/api/applications'
    const method = mode === 'edit' ? 'PATCH' : 'POST'

    const response = await fetch(url, {
      method,
      body: formData
    })
    const data = await response.json()

    if (data.error) {
      setError(data.error)
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (mode === 'edit') {
      posthog.capture('application_updated', {
        status,
        has_resume: !!resumeFile,
        has_cover_letter: !!coverLetterFile,
      })
    } else {
      posthog.capture('application_created', {
        status,
        has_resume: !!resumeFile,
        has_cover_letter: !!coverLetterFile,
      })
    }

    // success — go back to the list where the new/updated application is visible
    router.push('/applications')
  }

  async function handlePreview(type) {
    const response = await fetch(`/api/applications/${id}/files/${type}`)
    const data = await response.json()
    window.open(data.url, '_blank')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Back link — consistent with detail page, gives user an escape route at the top too */}
        <Link
        href="/applications"
        className="text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6 inline-block"
        >
        ← Back to Applications
        </Link>


      {/* Error message — validation or API errors from submit */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* Three-way branch: skeleton while fetching existing data in edit mode,
          loadError message if that fetch failed, otherwise the real form.
          Note: initialLoading starts false in create mode, so this skeleton
          only ever appears on the edit route. */}
      {initialLoading ? (
        <div className="space-y-5">

          {/* Company Name skeleton */}
          <div>
            <div className="h-3.5 w-28 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-11 w-full bg-slate-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Job Title skeleton */}
          <div>
            <div className="h-3.5 w-20 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-11 w-full bg-slate-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Job URL skeleton */}
          <div>
            <div className="h-3.5 w-16 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-11 w-full bg-slate-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Location skeleton */}
          <div>
            <div className="h-3.5 w-16 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-11 w-full bg-slate-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Status + Applied Date skeleton — side by side, matching the real layout */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="h-3.5 w-14 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-11 w-full bg-slate-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex-1">
              <div className="h-3.5 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-11 w-full bg-slate-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Notes skeleton — taller, matching the textarea */}
          <div>
            <div className="h-3.5 w-14 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-20 w-full bg-slate-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Resume upload skeleton */}
          <div>
            <div className="h-3.5 w-28 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Cover Letter upload skeleton */}
          <div>
            <div className="h-3.5 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Buttons skeleton */}
          <div className="flex gap-3 pt-2">
            <div className="h-11 w-36 bg-slate-200 rounded-lg animate-pulse"></div>
            <div className="h-11 w-24 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>

        </div>
      ) : loadError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {loadError}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Company Name — required */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Job Title — required */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Software Engineer Intern"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Job URL — optional */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Job URL
            </label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Location — optional */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New York, NY or Remote"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Status and Applied Date — side by side */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
                <option value="ghosted">Ghosted</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Applied Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Notes — optional, multiline */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this application..."
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
            />
          </div>

          {/* Resume Upload — never pre-filled, only sent if user selects a new file */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Resume (PDF only)
            </label>
            {/* Only shown in edit mode when a resume already exists */}
            {existingResumeFilename && (
              <button
              type="button"
              onClick={() => handlePreview('resume')}
              className="text-xs text-blue-600 hover:text-blue-700 mb-2 cursor-pointer"
              >
                Current file: {existingResumeFilename}
              </button>
            )}
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>
          

          {/* Cover Letter Upload — never pre-filled, only sent if user selects a new file */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cover Letter (PDF only)
            </label>
            {/* Only shown in edit when a cover letter already exist */}
            {existingCoverLetterFilename && (
              <button
              type="button"
              onClick={() => handlePreview('cover-letter')}
              className="text-xs text-blue-600 hover:text-blue-700 mb-2 cursor-pointer"
              >
                Current file: {existingCoverLetterFilename}
              </button>
            )}
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setCoverLetterFile(e.target.files[0])}
              className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
          </div>

          {/* Submit and Cancel buttons — button text changes based on mode and loading state */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading
                ? (mode === 'edit' ? 'Saving...' : 'Adding...')
                : (mode === 'edit' ? 'Save Changes' : 'Add Application')}
            </button>
            <button
              type="button"
              onClick={() => router.push('/applications')}
              className="text-slate-600 px-6 py-2.5 rounded-lg font-medium hover:bg-slate-100 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>

        </form>
      )}
    </div>
  )
}