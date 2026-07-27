'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Paperclip, Plus, TrendingUp, ChevronDown, Mail } from 'lucide-react'
import Image from 'next/image'
import dashboardScreenshot from './assets/dashboard.jpg'

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
      answer: 'Yes. Your uploaded resumes and cover letters are private to your account and not visible to other users. They are stored securely to provide the service and are never sold or shared with third parties.',
    }
  ]

  function toggleFaq(index) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">

      {/* Navbar */}
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

      {/* Hero */}
      <main className="flex-1 flex items-center px-6 py-15 md:py-24">
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
            {/* RESPONSIVE FIX: was `flex items-center gap-4` with no mobile
                fallback — both buttons squeezed into one row, forcing
                "Start Tracking For Free" to wrap across 3 lines inside a
                button sized for desktop.
                flex-col on mobile + no items-center at that level lets
                flexbox's default align-items:stretch kick in, so each
                button/link stretches to the full container width
                automatically — no separate w-full needed. sm:flex-row
                sm:items-center restores the original side-by-side,
                content-sized layout at sm and up. */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
          <div className="hidden md:block relative h-[26rem] max-w-2xl w-full md:justify-self-end group">

            {/* Back card - Anthropic */}
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
          -mt-16 left as-is: now that the hero above has a predictable
          height (no more broken card overflow inflating it unpredictably),
          this should overlap correctly — worth a fresh look after these
          changes rather than assuming. */}
      <section className="bg-gradient-to-b from-white to-slate-50 px-6 pb-12 md:pb-24">
        <div className="max-w-6xl mx-auto -mt-8 md:-mt-16">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={dashboardScreenshot}
              loading="eager"
              alt="JobFlow dashboard showing 23 total applications, a status breakdown across Applied, Interview, Offer, Rejected, and Ghosted, and a list of recent applications including Google, Microsoft, and Reddit"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
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