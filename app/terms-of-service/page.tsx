import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — PixelGamez',
  description: 'The terms and conditions for using PixelGamez.',
}

const sections = [
  {
    title: 'Use of the Site',
    body: 'The Site is provided for personal, non-commercial entertainment use. You must not attempt to disrupt, hack, or exploit the Site or its games, or scrape and redistribute Site content without permission. You are responsible for maintaining the security of your account, if applicable.',
  },
  {
    title: 'Third-Party Games',
    body: 'Many games on the Site are developed by third parties and embedded or linked for your convenience. We do not own these games and are not responsible for their content, functionality, or any data they may collect.',
  },
  {
    title: 'Accounts',
    body: 'If you create an account via Google Sign-In, you are responsible for all activity under that account. We reserve the right to suspend or terminate accounts that violate these Terms.',
  },
  {
    title: 'Advertising & Brand Integrations',
    body: 'The Site may display advertising, sponsored content, or brand integrations. These placements do not constitute an endorsement of any product, and we are not responsible for the practices of third-party advertisers or partners.',
  },
  {
    title: 'Disclaimer of Warranties',
    body: 'The Site and all games are provided "as is" without warranties of any kind. We do not guarantee the Site will be uninterrupted, secure, or error-free.',
  },
  {
    title: 'Limitation of Liability',
    body: 'To the fullest extent permitted by law, PixelGamez shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Site or any third-party game.',
  },
  {
    title: 'Changes to These Terms',
    body: 'We may revise these Terms at any time. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms.',
  },
  {
    title: 'Contact Us',
    body: 'Questions about these Terms can be sent to support@pixelgamez.com.',
  },
]

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs md:text-sm font-bold tracking-[0.2em] text-red-500 uppercase mb-4">
          Legal
        </p>
        <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.95] mb-6">
          Terms of Service
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
