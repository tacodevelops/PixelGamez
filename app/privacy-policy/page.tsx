import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — PixelGamez',
  description:
    'Learn how PixelGamez collects, uses, and protects your information.',
}

const sections = [
  {
    title: 'Information We Collect',
    body: 'If you sign in via Google, we collect your name, email, and profile picture. We also automatically collect usage data — pages visited, games played, device/browser type, and IP address — via analytics tools like Google Analytics and Google Tag Manager. Cookies are used to remember your preferences and keep you signed in.',
  },
  {
    title: 'How We Use Information',
    body: 'To operate and improve the Site, personalize content like recommended or favorited games, analyze traffic trends, display advertising, and communicate with you about updates or support requests.',
  },
  {
    title: 'Third-Party Services',
    body: 'We use Google Analytics, Google Tag Manager, Google OAuth, and advertising partners, each with their own privacy practices. Some games embedded on the Site are hosted by third-party developers and may have their own data policies.',
  },
  {
    title: "Children's Privacy",
    body: 'Our Site is intended for a general audience. We do not knowingly collect personal information from children under 13 without parental consent. Contact us if you believe a child has provided personal information.',
  },
  {
    title: 'Your Choices',
    body: 'You can disable cookies in your browser, request deletion of your account and data, or opt out of personalized advertising via your browser or device settings.',
  },
  {
    title: 'Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. Changes will be posted here with an updated date.',
  },
  {
    title: 'Contact Us',
    body: 'Questions about this Privacy Policy can be sent to support@pixelgamez.com.',
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs md:text-sm font-bold tracking-[0.2em] text-red-500 uppercase mb-4">
          Legal
        </p>
        <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.95] mb-6">
          Privacy Policy
        </h1>
        <p className="text-sm opacity-60 mb-16">Effective Date: July 10, 2026</p>

        {sections.map((section, i) => (
          <div key={section.title}>
            {i > 0 && <div className="border-t border-white/10 my-10" />}
            <h2 className="text-xl md:text-2xl font-bold uppercase mb-3">
              {section.title}
            </h2>
            <p className="text-sm md:text-base opacity-70 leading-relaxed">
              {section.body}
            </p>
          </div>
        ))}

        <div className="border-t border-white/10 my-10" />
        <p className="text-xs opacity-40">
          This document is a general template and does not constitute legal
          advice. Please have it reviewed by a qualified attorney before
          relying on it for legal compliance.
        </p>
      </div>
    </div>
  )
}
