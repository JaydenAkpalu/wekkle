import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getPostHogClient } from '@/lib/posthog-server'

//-- GET single application --

export async function GET(request, { params }) {
  // extract the application id from the URL params
  // e.g. /api/applications/abc-123 → id = 'abc-123'
  const { id } = await params

  // create supabase server client to talk to the database
  const supabase = await createClient()

  // get the currently logged in user from the session cookie
  const { data: { user } } = await supabase.auth.getUser()

  // if no user is logged in, return 401 unauthorized
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // query database for the single application matching this id
  // two filters: id matches the URL param AND user_id matches logged in user
  // this prevents users from accessing other users' applications
  const { data: application, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  // if not found or belongs to another user, return 404
  if (error) {
  if (error.code === 'PGRST116') {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }
  return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 })
}

  // return the application as JSON with default 200 status
  return NextResponse.json({ application })
}

//-- PATCH — update an existing application and optionally replace files --

export async function PATCH(request, { params }) {
  // extract the application id from the URL params
  const { id } = await params

  // create supabase server client to talk to the database
  const supabase = await createClient()

  // get the currently logged in user from the session cookie
  const { data: { user } } = await supabase.auth.getUser()

  // if no user is logged in, return 401 unauthorized
  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // read the request body as multipart/form-data
  // we use formData because the request may contain files
  const formData = await request.formData()

  // extract text fields — only fields that were sent will be non-null
  const companyName = formData.get('company_name')
  const jobTitle = formData.get('job_title')
  const jobUrl = formData.get('job_url')
  const location = formData.get('location')
  const status = formData.get('status')
  const appliedDate = formData.get('applied_date')
  const notes = formData.get('notes')

  // extract file fields — will be null if not included in the request
  const resumeFile = formData.get('resume')
  const coverLetterFile = formData.get('cover_letter')

  // build update object with only the fields that were actually sent
  // this ensures we only update what changed, not overwrite everything
  const updates = {}

  if (companyName) updates.company_name = companyName
  if (jobTitle) updates.job_title = jobTitle
  if (jobUrl !== null) updates.job_url = jobUrl
  if (location !== null) updates.location = location
  if (status) updates.status = status
  if (appliedDate) updates.applied_date = appliedDate
  if (notes !== null) updates.notes = notes

  // fetch the current application to get existing file paths
  // we need these to delete old files before uploading new ones
  const { data: existing, error: fetchError } = await supabase
    .from('applications')
    .select('resume_path, cover_letter_path')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError) {
  if (fetchError.code === 'PGRST116') {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }
  return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 })
}

  // if a new resume was uploaded, replace the existing one
  if (resumeFile && resumeFile.size > 0) {
    // delete the old resume from storage if one exists
    if (existing.resume_path) {
      const { error: deleteError } = await supabase.storage
        .from('application-files')
        .remove([existing.resume_path])

      if (deleteError) {
        return NextResponse.json({ error: 'Failed to delete old resume' }, { status: 500 })
      }
    }

    // upload the new resume to the same path pattern
    const resumePath = `${user.id}/${id}/resume.pdf`

    const { error: resumeError } = await supabase.storage
      .from('application-files')
      .upload(resumePath, resumeFile, { contentType: 'application/pdf' })

    if (resumeError) {
      return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 })
    }

    // add the new file path and filename to updates
    updates.resume_path = resumePath
    updates.resume_filename = resumeFile.name
  }

  // if a new cover letter was uploaded, replace the existing one
  if (coverLetterFile && coverLetterFile.size > 0) {
    // delete the old cover letter from storage if one exists
    if (existing.cover_letter_path) {
      const { error: deleteError } = await supabase.storage
        .from('application-files')
        .remove([existing.cover_letter_path])

      if (deleteError) {
        return NextResponse.json({ error: 'Failed to delete old cover letter' }, { status: 500 })
      }
    }

    // upload the new cover letter
    const coverLetterPath = `${user.id}/${id}/cover-letter.pdf`

    const { error: coverLetterError } = await supabase.storage
      .from('application-files')
      .upload(coverLetterPath, coverLetterFile, { contentType: 'application/pdf' })

    if (coverLetterError) {
      return NextResponse.json({ error: 'Failed to upload cover letter' }, { status: 500 })
    }

    // add the new file path and filename to updates
    updates.cover_letter_path = coverLetterPath
    updates.cover_letter_filename = coverLetterFile.name
  }

  // update the application row with all collected changes
  const { data: updated, error: updateError } = await supabase
    .from('applications')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  // if the update failed, return 500
  if (updateError) {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }

  // track the update server-side
  const posthogPatch = getPostHogClient()
  if (posthogPatch) {
    posthogPatch.capture({
      distinctId: user.id,
      event: 'application_updated',
      properties: {
        status: updated.status,
        has_resume: !!updated.resume_path,
        has_cover_letter: !!updated.cover_letter_path,
      },
    })
    await posthogPatch.flush()
  }

  // return the updated application with 200 success
  return NextResponse.json({ application: updated }, { status: 200 })
}



//-- DELETE — remove an application and all associated files --

export async function DELETE(request, { params }) {
  // extract the application id from the URL params
  const { id } = await params

  // create supabase server client to talk to the database
  const supabase = await createClient()

  // get the currently logged in user from the session cookie
  const { data: { user } } = await supabase.auth.getUser()

  // if no user is logged in, return 401 unauthorized
  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // fetch existing file paths before deleting anything
  // we need these to delete files from storage after the row is gone
  const { data: existing, error: fetchError } = await supabase
    .from('applications')
    .select('resume_path, cover_letter_path')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError) {
  if (fetchError.code === 'PGRST116') {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }
  return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 })
}

  // delete resume from storage if one exists
  if (existing.resume_path) {
    const { error: deleteResumeError } = await supabase.storage
      .from('application-files')
      .remove([existing.resume_path])

    if (deleteResumeError) {
      return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 })
    }
  }

  // delete cover letter from storage if one exists
  if (existing.cover_letter_path) {
    const { error: deleteCoverError } = await supabase.storage
      .from('application-files')
      .remove([existing.cover_letter_path])

    if (deleteCoverError) {
      return NextResponse.json({ error: 'Failed to delete cover letter' }, { status: 500 })
    }
  }

  // delete the application row from the database
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
  }

  // track the deletion server-side
  const posthogDelete = getPostHogClient()
  if (posthogDelete) {
    posthogDelete.capture({
      distinctId: user.id,
      event: 'application_deleted',
    })
    await posthogDelete.flush()
  }

  // return success confirmation
  return NextResponse.json({ success: true }, { status: 200 })
}