import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getPostHogClient } from '@/lib/posthog-server'

// -- GET --

export async function GET(request) {
  // create supabase server client to talk to the database
  const supabase = await createClient()

  // get the currently logged in user from the session cookie
  const { data: { user } } = await supabase.auth.getUser()

  // if no user is logged in, return 401 unauthorized
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // query the database for all applications belonging to this user
  // sorted by applied date, newest first
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('applied_date', { ascending: false })
    .order('created_at', { ascending: false })

  // if the database query failed, return 500 server error
  if (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }

  // return the applications as JSON
  return NextResponse.json({ applications: data })
}


//-- POST --

export async function POST(request) {
  // create supabase server client to talk to the database
  const supabase = await createClient()

  // get the currently logged in user from the session cookie
  const { data: { user } } = await supabase.auth.getUser()

  // if no user is logged in, return 401 unauthorized
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // read the request body as multipart/form-data
  // we use formData instead of json because the request contains files
  const formData = await request.formData()

  // extract text fields from the form data
  const companyName = formData.get('company_name')
  const jobTitle = formData.get('job_title')
  const jobUrl = formData.get('job_url')
  const location = formData.get('location')
  const status = formData.get('status')
  const appliedDate = formData.get('applied_date')
  const notes = formData.get('notes')

  // extract file fields from the form data (may be null if not provided)
  const resumeFile = formData.get('resume')
  const coverLetterFile = formData.get('cover_letter')

  // step 1: insert the application row first
  // we need the database-generated id before we can upload files
  // because the storage path includes the application id
  const { data: application, error: insertError } = await supabase
    .from('applications')
    .insert({
      user_id: user.id,
      company_name: companyName,
      job_title: jobTitle,
      job_url: jobUrl,
      location: location,
      status: status,
      applied_date: appliedDate,
      notes: notes,
    })
    .select()   // return the inserted row
    .single()   // return as object, not array

  // if the insert failed, return 500
  if (insertError) {
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }

  // step 2: upload files to supabase storage
  // fileUpdates collects the paths and filenames to save back to the row
  // it stays empty if no files were uploaded
  const fileUpdates = {}

  // upload resume if one was provided
  if (resumeFile && resumeFile.size > 0) {
    // build the storage path using user id and application id
    const resumePath = `${user.id}/${application.id}/resume.pdf`

    const { error: resumeError } = await supabase.storage
      .from('application-files')
      .upload(resumePath, resumeFile, { contentType: 'application/pdf' })

    if (resumeError) {
      return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 })
    }

    // store the path and original filename to save to the database row
    fileUpdates.resume_path = resumePath
    fileUpdates.resume_filename = resumeFile.name
  }

  // upload cover letter if one was provided
  if (coverLetterFile && coverLetterFile.size > 0) {
    const coverLetterPath = `${user.id}/${application.id}/cover-letter.pdf`

    const { error: coverLetterError } = await supabase.storage
      .from('application-files')
      .upload(coverLetterPath, coverLetterFile, { contentType: 'application/pdf' })

    if (coverLetterError) {
      return NextResponse.json({ error: 'Failed to upload cover letter' }, { status: 500 })
    }

    fileUpdates.cover_letter_path = coverLetterPath
    fileUpdates.cover_letter_filename = coverLetterFile.name
  }

  // step 3: if files were uploaded, update the row with their paths and filenames
  // Object.keys(fileUpdates).length > 0 checks if fileUpdates has any properties
  let finalApplication = application
  if (Object.keys(fileUpdates).length > 0) {
    const { data: updated, error: updateError } = await supabase
      .from('applications')
      .update(fileUpdates)       // only updates the file columns
      .eq('id', application.id) // only updates this specific row
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Failed to save file paths' }, { status: 500 })
    }

    finalApplication = updated
  }

  // track the creation server-side
  const posthog = getPostHogClient()
  if (posthog) {
    posthog.capture({
      distinctId: user.id,
      event: 'application_created',
      properties: {
        status: finalApplication.status,
        has_resume: !!finalApplication.resume_path,
        has_cover_letter: !!finalApplication.cover_letter_path,
      },
    })
    await posthog.flush()
  }

  return NextResponse.json({ application: finalApplication }, { status: 201 })
}
