'use client'

// imports
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import posthog from 'posthog-js'

export default function ApplicationDetailPage({ params }) {
  // states — application data, loading, error
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // extract application id from URL params
  const { id } = use(params)

  // fetch the application by id when the page loads
  useEffect(() => {
  async function fetchApplication() {
    try {
      const response = await fetch(`/api/applications/${id}`)
      if (!response.ok) {
        setError('Application not found')
        return
      }
      const data = await response.json()
      setApplication(data.application)
    } catch (err) {
      setError('Failed to load application')
    } finally {
      setLoading(false)
    }
  }
  fetchApplication()
}, [id])

  // fetch a signed download URL from the API and open the file in a new tab
  async function handleDownload(type) {
    const response = await fetch(`/api/applications/${id}/files/${type}`)
    const data = await response.json()
    posthog.capture('document_downloaded', { document_type: type })
    window.open(data.url, '_blank')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">

      {/* Back button — returns user to applications list */}
      <Link
        href="/applications"
        className="text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6 inline-block"
      >
        ← Back to Applications
      </Link>

      {/* Loading state — skeleton instead of plain text */}
      {loading && (
        <div>

          {/* Header skeleton — company name, job title, edit button */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="h-7 w-48 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="h-9 w-16 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Status badge skeleton */}
          <div className="mb-6">
            <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse"></div>
          </div>

          {/* Details card skeleton */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 mb-6">
            <div>
              <div className="h-3 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-28 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div>
              <div className="h-3 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-36 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div>
              <div className="h-3 w-24 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Documents card skeleton */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-16 bg-slate-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-28 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-28 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Error state — shown if fetch failed */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Application details — only shown when data is loaded */}
      {!loading && !error && application && (
        <div>

          {/* Header — company name, job title, edit button */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 capitalize">
                {application.company_name}
              </h1>
              <p className="text-slate-500 capitalize">{application.job_title}</p>
            </div>
            <Link
              href={`/applications/${id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Edit
            </Link>
          </div>

          {/* Status badge — color changes based on status value */}
          <div className="mb-6">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              application.status === 'applied' ? 'bg-blue-50 text-blue-600' :
              application.status === 'interview' ? 'bg-yellow-50 text-yellow-600' :
              application.status === 'offer' ? 'bg-green-50 text-green-600' :
              application.status === 'rejected' ? 'bg-red-50 text-red-600' :
              'bg-slate-100 text-slate-600'
            }`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>

          {/* Details card — shows all application fields */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 mb-6">

            {/* Applied date — always shown */}
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                Applied Date
              </p>
              <p className="text-slate-900">{application.applied_date}</p>
            </div>

            {/* Location — only shown if it exists */}
            {application.location && (
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                  Location
                </p>
                <p className="text-slate-900">{application.location}</p>
              </div>
            )}

            {/* Job URL — only shown if it exists, opens in new tab */}
            {application.job_url && (
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                  Job URL
                </p>
                <a
                  href={application.job_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm break-all"
                >
                  {application.job_url}
                </a>
              </div>
            )}

            {/* Notes — only shown if they exist */}
            {application.notes && (
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
                  Notes
                </p>
                <p className="text-slate-900 text-sm whitespace-pre-wrap">
                  {application.notes}
                </p>
              </div>
            )}

          </div>

          {/* Documents card — resume and cover letter download buttons */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Documents</h2>

            <div className="space-y-3">

              {/* Resume — show download button if uploaded, otherwise show placeholder */}
              {application.resume_path ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Resume</p>
                    <p className="text-xs text-slate-400">{application.resume_filename}</p>
                  </div>
                  <button
                    onClick={() => handleDownload('resume')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    Download
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-400">No resume uploaded</p>
              )}

              {/* Cover letter — show download button if uploaded, otherwise show placeholder */}
              {application.cover_letter_path ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Cover Letter</p>
                    <p className="text-xs text-slate-400">{application.cover_letter_filename}</p>
                  </div>
                  <button
                    onClick={() => handleDownload('cover-letter')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    Download
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-400">No cover letter uploaded</p>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  )
}