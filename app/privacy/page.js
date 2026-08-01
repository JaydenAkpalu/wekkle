
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Wekkle Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last updated: July 31, 2026</p>

        <p className="text-slate-700 mb-4">
          Wekkle (&quot;Wekkle,&quot; &quot;we,&quot; &quot;us&quot;) is operated by the Wekkle team. This policy explains what information Wekkle collects, how it&apos;s used, and what control you have over it.
        </p>

        <p className="text-slate-700 mb-10">
          By using wekkle.app, you agree to this policy. If you don&apos;t agree, please don&apos;t use the app.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Information We Collect</h2>

          <h3 className="font-semibold text-slate-800 mt-4 mb-1">Account information</h3>
          <p className="text-slate-700 mb-3">
            When you sign up, we collect your email address and a password. Your password is never stored in plain text — it&apos;s handled entirely by Supabase, our authentication provider, using industry-standard hashing.
          </p>

          <h3 className="font-semibold text-slate-800 mt-4 mb-1">Application data</h3>
          <p className="text-slate-700 mb-3">
            Information you enter about your job applications: company name, job title, job URL, location, status, applied date, and any notes you add.
          </p>

          <h3 className="font-semibold text-slate-800 mt-4 mb-1">Uploaded documents</h3>
          <p className="text-slate-700 mb-3">
            Resumes and cover letters you upload (PDF only, up to 5MB each). These are stored in a private file storage bucket and are never publicly accessible.
          </p>

          <h3 className="font-semibold text-slate-800 mt-4 mb-1">Usage data</h3>
          <p className="text-slate-700">
            We use PostHog and Vercel Analytics to understand how the app is used — pages visited, actions taken (like adding or updating an application), and general device/browser information. This helps us fix bugs and improve the product. We do not use this data to build advertising profiles.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">2. How We Use Your Information</h2>
          <p className="text-slate-700 mb-2">We use your information to:</p>
          <ul className="list-disc list-inside text-slate-700 space-y-1">
            <li>Provide and maintain your account and application tracker</li>
            <li>Store and let you retrieve your resumes and cover letters</li>
            <li>Send you account-related emails (like email verification) via Resend</li>
            <li>Understand usage patterns so we can improve Wekkle</li>
            <li>Respond to support requests you send us</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Who We Share Data With</h2>
          <p className="text-slate-700 mb-3">
            <strong>We do not sell your data.</strong> Not to recruiters, not to advertisers, not to anyone.
          </p>
          <p className="text-slate-700 mb-4">
            We use the following third-party services to run Wekkle, each of which processes data on our behalf:
          </p>

          <table className="w-full border border-slate-200 text-sm mb-4">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-200 px-3 py-2 text-left">Service</th>
                <th className="border border-slate-200 px-3 py-2 text-left">Purpose</th>
                <th className="border border-slate-200 px-3 py-2 text-left">What it sees</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 px-3 py-2">Supabase</td>
                <td className="border border-slate-200 px-3 py-2">Authentication, database, file storage</td>
                <td className="border border-slate-200 px-3 py-2">Account info, application data, uploaded files</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">PostHog</td>
                <td className="border border-slate-200 px-3 py-2">Product analytics</td>
                <td className="border border-slate-200 px-3 py-2">Usage events, device/browser info</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">Vercel</td>
                <td className="border border-slate-200 px-3 py-2">Hosting, analytics</td>
                <td className="border border-slate-200 px-3 py-2">Usage events, IP address (for hosting)</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2">Resend</td>
                <td className="border border-slate-200 px-3 py-2">Transactional email (verification, notifications)</td>
                <td className="border border-slate-200 px-3 py-2">Your email address</td>
              </tr>
            </tbody>
          </table>

          <p className="text-slate-700">
            These providers are bound by their own privacy and security commitments, and we only share what&apos;s necessary for them to perform their function.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Cookies</h2>
          <p className="text-slate-700">
            Wekkle uses a session cookie to keep you logged in. This cookie is essential to the app working and isn&apos;t used for advertising or tracking across other sites.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Data Storage &amp; Security</h2>
          <ul className="list-disc list-inside text-slate-700 space-y-1">
            <li>All data is transmitted over HTTPS.</li>
            <li>Your application data is protected by Row Level Security (RLS) — a database-level rule ensuring you can only ever access your own data, even if there were a bug elsewhere in the app.</li>
            <li>Uploaded files are stored in a private bucket. The only way to access a file is through a temporary signed URL generated specifically for you, which expires after 60 seconds.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Data Retention &amp; Deletion</h2>
          <p className="text-slate-700">
            We retain your data for as long as your account is active. If you&apos;d like your account and all associated data (including uploaded files) permanently deleted, contact us at{' '}
            <a href="mailto:privacy@wekkle.app" className="text-blue-600 hover:underline">privacy@wekkle.app</a>{' '}
            and we&apos;ll process the deletion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Your Rights</h2>
          <p className="text-slate-700">
            Depending on where you live, you may have rights to access, correct, export, or delete your personal data. You can exercise any of these rights by contacting us directly — we&apos;ll respond as quickly as we can.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Children&apos;s Privacy</h2>
          <p className="text-slate-700">
            Wekkle is not directed at children under 13, and we do not knowingly collect data from anyone under that age.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Changes to This Policy</h2>
          <p className="text-slate-700">
            We may update this policy as Wekkle grows. If we make material changes, we&apos;ll update the &quot;Last updated&quot; date above. Continued use of Wekkle after changes means you agree to the updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">10. Contact Us</h2>
          <p className="text-slate-700">
            Questions about this policy or your data? Email us at{' '}
            <a href="mailto:privacy@wekkle.app" className="text-blue-600 hover:underline">privacy@wekkle.app</a>.
          </p>
        </section>
      </div>
    </div>
  )
}