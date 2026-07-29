'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Paperclip, Plus, TrendingUp, ChevronDown, Mail } from 'lucide-react'
import Image from 'next/image'
import dashboardScreenshot from './assets/dashboard.jpg'

// Pool of placeholder avatars the badge cycles through, simulating new
// students joining. Swap these for real user initials once you have
// actual sign-ups worth showing — this is a stand-in until then.
const AVATAR_POOL = [
  { id: 1, initial: 'S', bg: 'bg-blue-200', text: 'text-blue-800' },
  { id: 2, initial: 'M', bg: 'bg-green-200', text: 'text-green-800' },
  { id: 3, initial: 'R', bg: 'bg-orange-200', text: 'text-orange-800' },
  { id: 4, initial: 'A', bg: 'bg-purple-200', text: 'text-purple-800' },
  { id: 5, initial: 'K', bg: 'bg-pink-200', text: 'text-pink-800' },
  { id: 6, initial: 'J', bg: 'bg-teal-200', text: 'text-teal-800' },
]

export default function Home() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'Is JobFlow free?',
      answer: 'Yes — no paid tier, no credit card required.',
    },
    {
      question: 'What file types can I upload?',
      answer: 'PDF only, up to 5MB per file.',
    },
    {
      question: 'Can I edit or delete an application after adding it?',
      answer: 'Yes — edit any field or delete an application entirely, any time, from your applications list.',
    },
    {
      question: 'Is there a limit on how many applications I can track?',
      answer: 'No cap — track as many as you need.',
    },
    {
      question: 'Are my resumes and cover letters private?',
      answer: "Yes. Your resume and cover letter are stored in a private file bucket and there's no public link to them. Only you can access your own files, and downloads use temporary secure links that expire within a minute.",
    }
  ]

  function toggleFaq(index) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">

      {/* Pop-in animation for the beta badge's avatar circles. A plain
          <style> tag works fine here — no styled-jsx or extra package
          needed, it just renders as a real <style> element. Placed near
          the top of the page; CSS applies globally to the document
          regardless of where in the DOM the tag sits. */}
      <style>{`
        @keyframes avatar-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-avatar-marquee {
          animation: avatar-marquee 8s linear infinite;
        }
      `}</style>

      {/* Navbar */}
      <nav className="border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900">JobFlow</span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center px-6 py-15 md:py-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Left column - text content */}
          <div>
            <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
              Never wonder which<br />
              resume you sent.
            </h1>
            <p className="text-xl text-slate-500 mb-10">
              Built for students applying to dozens of internships. Track every application alongside the exact resume and cover letter you submitted.
            </p>
            {/* RESPONSIVE FIX: was `flex items-center gap-4` with no mobile
                fallback — both buttons squeezed into one row, forcing
                "Start Tracking For Free" to wrap across 3 lines inside a
                button sized for desktop.
                flex-col on mobile + no items-center at that level lets
                flexbox's default align-items:stretch kick in, so each
                button/link stretches to the full container width
                automatically — no separate w-full needed. sm:flex-row
                sm:items-center restores the original side-by-side,
                content-sized layout at sm and up.
                mb-9 -> mb-6: freed up a little room now that the beta
                badge sits directly below this row instead of this being
                the last element before the card stack. */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 lg:mb-0">
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg text-center"
              >
                Start Tracking For Free
              </Link>
              <button
                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                className="text-slate-600 px-8 py-3 rounded-lg font-medium hover:text-slate-900 transition-colors text-lg border border-slate-200 hover:border-slate-300 cursor-pointer text-center"
              >
                See how it works
              </button>
            </div>

            {/* Beta badge, animated avatar stack.
                - mt-8 (was mt-5): more breathing room above it.
                - w-8 h-8 (was w-7 h-7): slightly bigger, 32px circles.
                - text-slate-700 (was text-slate-600): darker instead of
                  larger, so it reads more clearly without disrupting the
                  size hierarchy (h1 > CTA label > this).
                - key={avatar.id} + animate-avatar-pop: every time
                  visibleAvatars changes (see the interval effect above),
                  React remounts just the swapped circle, which replays
                  the pop-in animation — same mechanism drives both the
                  initial staggered entrance and each later "someone new
                  joined" swap, no separate animation logic needed.
                - animationDelay staggers the initial 3 on page load;
                  harmless on later single-avatar swaps since only one
                  circle animates at a time anyway. */}
            <div className="mt-8 flex items-center gap-3">
              {/* Marquee window: bg + border give the clipped strip a
                  defined boundary instead of floating in blank space.
                  The mask-image fades circles to transparent near the
                  edges as they scroll through, instead of a hard clip —
                  that hard edge was the "line" artifact. Kept as inline
                  style since mask-image needs the -webkit- prefix for
                  Safari, which Tailwind's arbitrary-value syntax can't
                  express cleanly. */}
              <div
                className="relative w-24 h-10 overflow-hidden rounded-full bg-slate-50 border border-slate-200"
                style={{
                  WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                  maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                }}
              >
                <div className="flex items-center h-full gap-2 px-1 w-max animate-avatar-marquee">
                  {[...AVATAR_POOL, ...AVATAR_POOL].map((avatar, i) => (
                    <div
                      key={i}
                      className={`flex-shrink-0 w-8 h-8 rounded-full ${avatar.bg} border-2 border-white flex items-center justify-center text-xs font-medium ${avatar.text}`}
                    >
                      {avatar.initial}
                    </div>
                  ))}
                </div>
              </div>
              <span className="text-sm text-slate-700">
                Early beta — join the first 100 students shaping what we build next.
              </span>
            </div>
          </div>

          {/* Right column - stacked application cards.
              RESPONSIVE FIX: hidden entirely below md, not scaled down.
              These cards are w-80 with offsets like right-32 — that
              combination needs 500px+ of horizontal room to render without
              overflowing, which no phone screen has. Scaling them down to
              fit would make the filename/status text illegible, defeating
              the point of showing them at all. The dashboard proof section
              below still carries "this is real" on mobile, so nothing is
              lost, just not duplicated. */}
          <div className="hidden lg:block relative h-[26rem] max-w-2xl w-full lg:justify-self-end group">

            {/* Back card - Anthropic */}
            <div className="absolute top-25 right-32 w-80 bg-slate-900 border border-slate-800 rounded-xl p-6 -rotate-[5deg] shadow-[0_30px_50px_-12px_rgba(0,0,0,0.50),0_0_50px_-5px_rgba(47,99,230,0.50)]">
              <p className="text-base font-medium text-slate-50">Anthropic</p>
              <p className="text-sm text-slate-400 mb-4">AI Eng Intern</p>
              <span className="inline-block text-sm font-medium text-white bg-blue-600 px-3 py-1 rounded-full mb-4">
                Applied
              </span>
              <div className="border-t border-slate-700 pt-3 flex items-center gap-2">
                <Paperclip size={15} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-mono">anthropic_ai-eng_resume.pdf</span>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <Paperclip size={15} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-mono">anthropic_cover_letter.pdf</span>
              </div>
            </div>

            {/* Middle card - Figma */}
            <div className="absolute top-14 right-22 w-80 bg-slate-900 border border-slate-800 rounded-xl p-6 rotate-[2deg] ">
              <p className="text-base font-medium text-slate-50">Figma</p>
              <p className="text-sm text-slate-400 mb-4">Product Eng Intern</p>
              <span className="inline-block text-sm font-medium text-green-950 bg-green-500 px-3 py-1 rounded-full mb-4">
                Offer
              </span>
              <div className="border-t border-slate-700 pt-3 flex items-center gap-2">
                <Paperclip size={15} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-mono">figma_product-eng_resume.pdf</span>
              </div>
            </div>

            {/* Front card - Google */}
            <div className="absolute top-2 right-5 w-80 bg-slate-900 border border-slate-800 rounded-xl p-7 rotate-[4deg] shadow-xl">
              <p className="text-lg font-medium text-slate-50">Google</p>
              <p className="text-sm text-slate-400 mb-4">Software Engineer Intern</p>
              <span className="inline-block text-sm font-medium text-yellow-950 bg-yellow-500 px-3 py-1 rounded-full mb-4">
                Interview
              </span>
              <div className="border-t border-slate-700 pt-3 flex items-center gap-2">
                <Paperclip size={16} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-mono">google_swe_resume.pdf</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Dashboard proof section.
          RESPONSIVE FIX: pb-24 (96px) was fixed regardless of screen size.
          At mobile width the image itself renders much shorter (~200px
          tall), so 96px of empty space below it reads as proportionally
          huge — nearly half the image's own height. pb-12 md:pb-24 halves
          it on mobile, restores the original value at md and up.
          -mt-8 -> mt-4 on mobile: the beta badge added real height to the
          hero's left column (the only column visible on mobile, since the
          card stack is lg:block-only), so the old fixed -32px pull-up now
          sits tighter against the badge than intended. mt-4 gives it a
          small positive gap instead. md:-mt-16 untouched — the desktop
          hero's height is set by the taller card-stack column, which the
          badge didn't change, so nothing needed fixing there. */}
      <section className="bg-gradient-to-b from-white to-slate-50 px-6 pb-12 md:pb-24">
        <div className="max-w-7xl mx-auto mt-4 md:-mt-16">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xl">
            {/* Desktop: full screenshot, stays inside the max-w-7xl box */}
            <Image
              src={dashboardScreenshot}
              loading="eager"
              alt="JobFlow dashboard showing 23 total applications, a status breakdown across Applied, Interview, Offer, Rejected, and Ghosted, and a list of recent applications including Google, Microsoft, and Reddit"
              className="hidden md:block w-full h-auto"
            />
          </div>
        </div>

        {/* Mobile: pulled out to the section's own full width, ignoring max-w-7xl */}
        <div className="md:hidden -mr-6">
          <div className="relative overflow-hidden border-y border-slate-200 shadow-2xl">
            <Image
              src={dashboardScreenshot}
              loading="eager"
              alt="JobFlow dashboard showing 23 total applications, a status breakdown across Applied, Interview, Offer, Rejected, and Ghosted, and a list of recent applications including Google, Microsoft, and Reddit"
              className="w-[200%] max-w-none h-auto"
            />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How it works</h2>
            <p className="text-lg text-slate-500">Three steps. That's the whole system.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            <div>
              <div className="relative inline-block mb-5">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Plus size={22} className="text-blue-600" />
                </div>
                <span className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">1</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Add an application</h3>
              <p className="text-slate-500">Company, role, status, and the date you applied.</p>
            </div>

            <div>
              <div className="relative inline-block mb-5">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Paperclip size={22} className="text-blue-600" />
                </div>
                <span className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">2</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Attach exactly what you sent</h3>
              <p className="text-slate-500">The resume and cover letter version you used, for that specific application.</p>
            </div>

            <div>
              <div className="relative inline-block mb-5">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <TrendingUp size={22} className="text-blue-600" />
                </div>
                <span className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">3</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Track it from applied to offer</h3>
              <p className="text-slate-500">Status updates as things move, all visible on one dashboard.</p>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-medium text-slate-900">{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform flex-shrink-0 ml-4 ${openIndex === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {openIndex === index && (
                  <p className="px-6 pb-4 text-slate-500">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white border-t border-slate-200 px-6 py-14 md:py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready for your next interview?</h2>
        <p className="text-slate-500 mb-8">Get organized today. Free to use, takes less than two minutes to set up.</p>
        <Link
          href="/signup"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
        >
          Start Tracking For Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
          <span className="text-slate-400">© 2026 JobFlow. Built for job seekers.</span>
          <a
            href="mailto:jobflow.feedback@gmail.com?subject=JobFlow Feedback"
            className="flex items-center gap-1.5 text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            <Mail size={14} />
            Send feedback
          </a>
        </div>
      </footer>

    </div>
  )
}