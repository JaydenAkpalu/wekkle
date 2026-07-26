import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  // extract application id and file type from URL params
  // e.g. /api/applications/abc-123/files/resume → id = 'abc-123', type = 'resume'
  const { id, type } = await params

  // create supabase server client to talk to the database
  const supabase = await createClient()

  // get the currently logged in user from the session cookie
  const { data: { user } } = await supabase.auth.getUser()

  // if no user is logged in, return 401 unauthorized
  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // validate type — must be exactly 'resume' or 'cover-letter'
  // .includes() checks if type exists in the allowed values array
  // return 400 Bad Request if an invalid type was sent
  if (!['resume', 'cover-letter'].includes(type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  // fetch only the file-related columns from this application
  // we need both path (to generate the URL) and filename (to return to frontend)
  const { data: application, error: fetchError } = await supabase
    .from('applications')
    .select('resume_path, resume_filename, cover_letter_path, cover_letter_filename')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError) {
  if (fetchError.code === 'PGRST116') {
    // no row matched — either doesn't exist, or belongs to someone else
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }
  // any other error code — a genuine, unexpected server-side failure
  return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 })
}

  // determine which file path and filename to use based on the requested type
  let filePath
  let fileName

  if (type === 'resume') {
    filePath = application.resume_path
    fileName = application.resume_filename
  } else {
    filePath = application.cover_letter_path
    fileName = application.cover_letter_filename
  }

  // if no file exists for this type, return 404
  // this happens when the application was created without uploading that file
  if (!filePath) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  // generate a signed URL — a temporary link that expires in 60 seconds
  // required because the storage bucket is private
  // the frontend uses this URL to download the file directly from storage
  const { data, error } = await supabase.storage
    .from('application-files')
    .createSignedUrl(filePath, 60)

  if (error) {
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
  }

  // return the signed URL, original filename, and mime type
  return NextResponse.json({
    url: data.signedUrl,
    filename: fileName,
    mimeType: 'application/pdf'
  })
}