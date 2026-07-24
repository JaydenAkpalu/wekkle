'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Paperclip, Plus, TrendingUp, ChevronDown, Mail } from 'lucide-react'
import Image from 'next/image'
// Imported as a module (not a public/ URL string) — Next.js reads this file
// directly at build time and knows its real width/height automatically.
import dashboardScreenshot from './assets/dashboard.jpg'

export default function Home() {
  // Tracks which FAQ item is open. null = none open. A number = that index is open.
  const [openIndex, setOpenIndex] = useState(null)

  // Array of Q&A objects — .map() below loops over this instead of
  // hardcoding four separate <div> blocks by hand.
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
  ]

  // Toggle logic: if the clicked index is already open, close it (null).
  // Otherwise, open the clicked one. Only one FAQ can be open at a time.
  function toggleFaq(index) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">

      {/* Navbar — shared max-w-6xl container, same width used by hero and dashboard
          section below, so all three stay visually aligned on the same edges */}
      <nav className="border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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

      {/* Hero — no flex-1/items-center here (removed on purpose): that combo was
          stretching this section to fill the whole screen height on tall monitors,
          which broke the -mt-16 overlap on the dashboard section below it. */}
      <main className="flex-1 flex items-center px-6 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* Left column - text content */}
          <div>
            <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
              Never wonder which<br />
              resume you sent.
            </h1>
            <p className="text-xl text-slate-500 mb-10">
              Track every application with the exact resume and cover letter you submitted, so you can review them before every interview.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
              >
                Start Tracking For Free
              </Link>
              {/* Deliberately a <button>, not a <Link href="#how-it-works">.
                  A hash link only re-scrolls when the URL hash actually changes —
                  clicking it twice in a row (without leaving the page) does nothing
                  the second time. scrollIntoView() re-runs on every click regardless. */}
              <button
                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                className="text-slate-600 px-8 py-3 rounded-lg font-medium hover:text-slate-900 transition-colors text-lg border border-slate-200 hover:border-slate-300 cursor-pointer"
              >
                See how it works
              </button>
            </div>
          </div>

          {/* Right column - stacked application cards.
              relative on the wrapper + absolute on each card is what allows them
              to overlap each other (same mechanism as your dashboard layout's
              fixed sidebar/navbar, just applied to three small cards instead). */}
          <div className="relative h-[26rem] max-w-2xl w-full justify-self-center md:justify-self-end group">

            {/* Back card - Anthropic.
                shadow-[...] is two shadows stacked in one arbitrary value:
                first part = normal drop shadow (depth), second part = a soft
                zero-offset blue-tinted shadow (the "glow"). This card carries
                the glow because it has open background on its exposed edges —
                the front/middle cards don't, so a glow there would just smear
                onto the neighboring card instead of reading as a glow. */}
            <div className="absolute top-25 right-32 w-80 bg-slate-900 border border-slate-800 rounded-xl p-6 -rotate-[5deg] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_50px_-5px_rgba(37,99,235,0.50)]">
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

            {/* Middle card - Figma. No shadow — sits flat between the two
                cards that do have elevation, on purpose. */}
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

           {/* Front card - Google. Plain shadow-xl (depth only, no glow) —
               this is the card meant to read as "closest to the viewer",
               so it keeps its own distinct elevation instead of sharing
               the back card's glow treatment. */}
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
          bg-gradient-to-b from-white to-slate-50: starts as pure white (matching
          the hero exactly, no visible seam) and eases into light gray by the
          bottom of the section.
          -mt-16 on the inner wrapper pulls the white image card UP into the
          hero's bottom padding (py-24), so the card visually crosses the
          boundary between the two sections instead of the page just stacking
          two flat blocks. */}
      <section className="bg-gradient-to-b from-white to-slate-50 px-6 pb-24">
        <div className="max-w-6xl mx-auto -mt-16">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={dashboardScreenshot}
              // loading="eager" overrides next/image's default lazy-loading.
              // This image is above the fold, so Next.js flagged it as the
              // LCP (Largest Contentful Paint) element and recommended this.
              loading="eager"
              alt="JobFlow dashboard showing 23 total applications, a status breakdown across Applied, Interview, Offer, Rejected, and Ghosted, and a list of recent applications including Google, Microsoft, and Reddit"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* How it works — id="how-it-works" is the scroll target for the hero
          button above. Three-column grid on desktop, stacks to one column
          on mobile automatically via md:grid-cols-3. */}
      <section id="how-it-works" className="bg-white px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How it works</h2>
            <p className="text-lg text-slate-500">Three steps. That's the whole system.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Step 1 — icon + small numbered circle badge positioned on top
                of it via relative/absolute, same overlap technique as the
                hero cards, just at a much smaller scale. */}
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

            {/* Step 2 — reuses the Paperclip icon from the hero cards on purpose,
                so the same icon means the same thing in both places. */}
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

            {/* Step 3 */}
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

      {/* FAQ — no border-t here on purpose (kept as plain bg-white, matching
          the section above it). Runs on the faqs array + openIndex state
          defined at the top of the component. */}
      <section className="bg-white px-6 py-24">
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
                  {/* Chevron rotates 180° when this item is the open one —
                      same ternary-inside-template-literal pattern as your
                      status badge colors, just toggling a rotate class
                      instead of a color class. */}
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform flex-shrink-0 ml-4 ${openIndex === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {/* Answer only renders in the DOM at all when this is the
                    open index — same && conditional-render pattern used
                    for optional fields on the application detail page. */}
                {openIndex === index && (
                  <p className="px-6 pb-4 text-slate-500">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — border-t here (unlike FAQ above) is the one visual
          divider on this half of the page, marking the boundary before
          the closing pitch + footer. */}
      <section className="bg-white border-t border-slate-200 px-6 py-20 text-center">
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
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
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