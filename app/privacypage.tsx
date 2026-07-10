import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — PixelGamez',
  description:
    'Learn how PixelGamez collects, uses, and protects your information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-[var(--text-primary)]">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm opacity-70 mb-8">Last updated: July 10, 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
        <p className="mb-3">
          PixelGamez (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates
          pixelgamez.com (the &quot;Site&quot;), a free online games platform. This
          Privacy Policy explains what information we collect, how we use it,
          and the choices you have.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Account information:</strong> If you sign in (e.g. via
            Google), we collect your name, email address, and profile picture
            to create and manage your account.
          </li>
          <li>
            <strong>Usage data:</strong> We automatically collect data such as
            pages visited, games played, device/browser type, and IP address
            via analytics tools like Google Analytics and Google Tag Manager.
          </li>
          <li>
            <strong>Cookies:</strong> We use cookies and similar technologies
            to remember your preferences, keep you signed in, and measure
            site performance.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. How We Use Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To operate, maintain, and improve the Site and its games</li>
          <li>To personalize content, such as recommended or favorited games</li>
          <li>To analyze traffic and usage trends</li>
          <li>To display advertising and measure ad performance</li>
          <li>To communicate with you about updates or support requests</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
        <p className="mb-3">
          We use third-party services including Google Analytics, Google Tag
          Manager, Google OAuth, and advertising partners. These services may
          set their own cookies and collect data according to their own
          privacy policies. Some games embedded on the Site are hosted by
          third-party developers and may have their own data practices.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Children&apos;s Privacy</h2>
        <p className="mb-3">
          Our Site is intended for a general audience. We do not knowingly
          collect personal information from children under 13 without
          parental consent. If you believe a child has provided us personal
          information, please contact us so we can delete it.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Your Choices</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>You can disable cookies in your browser settings</li>
          <li>You can request deletion of your account and associated data</li>
          <li>You can opt out of personalized advertising via your browser or device settings</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Changes to This Policy</h2>
        <p className="mb-3">
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated &quot;Last updated&quot; date.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, contact us at{' '}
          <a href="mailto:support@pixelgamez.com" className="text-red-500 hover:underline">
            support@pixelgamez.com
          </a>
          .
        </p>
      </section>

      <p className="mt-10 text-sm opacity-60">
        This document is a general template and does not constitute legal
        advice. Please have it reviewed by a qualified attorney before
        relying on it for legal compliance.
      </p>
    </div>
  )
}
