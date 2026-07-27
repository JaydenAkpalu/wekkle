'use client'

// imports
import { useState, useEffect } from 'react'
import Link from 'next/link'
import posthog from 'posthog-js'

export default function ApplicationsPage() {
  // state — applications list, loading, error, search and filter controls
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // holds the id of the application pending deletion, or null if no modal is showing
  // storing the id (not just true/false) lets the modal know WHICH application to delete
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  // fetch all applications when the page first loads
  useEffect(() => {
    async function fetchApplications() {
      try {
        const response = await fetch('/api/applications')

        if (!response.ok) {
          setError('Failed to load applications')
          return
        }

        const data = await response.json()
        setApplications(data.applications)
      } catch (err) {
        setError('Failed to load applications')
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  // filter applications client-side based on search query and status filter
  // this runs on every render so the list updates instantly as the user types
  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      searchQuery === '' ||
      application.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.job_title.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === '' || application.status === statusFilter

    return matchesSearch && matchesStatus
  })

  function handleDeleteClick(id) {
    setConfirmDeleteId(id)
  }

  async function handleDelete() {
    const response = await fetch(`/api/applications/${confirmDeleteId}`, { method: 'DELETE' })

    if (!response.ok) {
      setError('Failed to delete application')
      setConfirmDeleteId(null)
      return
    }

    posthog.capture('application_deleted')

    setApplications(applications.filter((app) => app.id !== confirmDeleteId))
    setConfirmDeleteId(null)
  }

  function handleCancelDelete() {
    setConfirmDeleteId(null)
  }

  function handleClearFilters() {
    setSearchQuery('')
    setStatusFilter('')
  }

  return (
    <div className="p-6">

      {/* Header — page title and add button */}
      <div className="flex items-center justify-end mb-6">
        <Link
          href="/applications/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Application
        </Link>
      </div>

      {/* Filters — search input and status dropdown.
          RESPONSIVE: stacks vertically below sm, sits side-by-side at sm
          and up. Search input was already flex-1 so it naturally goes
          full-width when stacked. */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by company or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="ghosted">Ghosted</option>
        </select>
      </div>

      {/* Loading state — skeleton.
          RESPONSIVE: matches the real list's layout exactly (see below) —
          a skeleton needs to mirror its real content's responsive
          behavior, or it'll visibly jump/reflow the instant real data
          replaces it. */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                </div>
                <div className="h-3 w-40 bg-slate-200 rounded animate-pulse mb-1"></div>
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2 sm:ml-4">
                <div className="h-8 w-12 bg-slate-200 rounded-lg animate-pulse"></div>
                <div className="h-8 w-12 bg-slate-200 rounded-lg animate-pulse"></div>
                <div className="h-8 w-14 bg-slate-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state — shown if fetch failed */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* No applications at all */}
      {!loading && !error && applications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">No applications yet.</p>
          <Link
            href="/applications/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Add your first application
          </Link>
        </div>
      )}

      {/* Has applications but none match filter */}
      {!loading && !error && applications.length > 0 && filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">No applications match your search or filter</p>
          <button
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Applications list — rendered when data is loaded and results exist.
          RESPONSIVE FIX: was `flex items-center justify-between` with no
          fallback — on a narrow screen this crammed company name, status
          badge, and three action buttons into one horizontal line with
          nowhere to shrink to. Now stacks below sm: info on top, actions
          in their own row underneath with real tap-target room. At sm and
          up, behaves exactly as before (side-by-side, no visual change). */}
      {!loading && !error && filteredApplications.length > 0 && (
        <div className="space-y-3">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-slate-300 transition-colors"
            >
              {/* Application info — company, status badge, role, date */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-slate-900 capitalize">
                    {application.company_name}
                  </h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    application.status === 'applied' ? 'bg-blue-50 text-blue-600' :
                    application.status === 'interview' ? 'bg-yellow-50 text-yellow-600' :
                    application.status === 'offer' ? 'bg-green-50 text-green-600' :
                    application.status === 'rejected' ? 'bg-red-50 text-red-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-slate-500 capitalize">{application.job_title}</p>
                <p className="text-xs text-slate-400 mt-1">{application.applied_date}</p>
              </div>

              {/* Action buttons — view, edit, delete.
                  ml-4 → sm:ml-4: that left margin only makes sense when
                  actions sit beside the info, not stacked below it. gap-3
                  on the parent already handles spacing in both layouts. */}
              <div className="flex items-center gap-2 sm:ml-4">
                <Link
                  href={`/applications/${application.id}`}
                  className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  View
                </Link>
                <Link
                  href={`/applications/${application.id}/edit`}
                  className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteClick(application.id)}
                  className="text-sm text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal — already responsive as-is.
          max-w-sm caps the width, mx-4 guarantees side breathing room on
          any screen size, so no changes needed here. */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-semibold text-slate-900 mb-2">Delete this application?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}