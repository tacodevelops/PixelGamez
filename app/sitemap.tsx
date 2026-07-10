import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Site Map — PixelGamez',
  description: 'Browse all pages available on PixelGamez.',
}

const sections: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: 'Games',
    links: [
      { href: '/', label: 'Home' },
      { href: '/trending', label: 'Trending' },
      { href: '/new', label: 'New' },
      { href: '/popular', label: 'Popular' },
      { href: '/up-and-coming', label: 'Up & Coming' },
      { href: '/most-visited', label: 'Most Visited' },
      { href: '/recommended', label: 'Recommended' },
    ],
  },
  {
    title: 'For Developers & Brands',
    links: [
      { href: '/developer', label: 'Developer' },
      { href: '/brand-integration', label: 'Brand Integration' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms-of-service', label: 'Terms of Service' },
    ],
  },
]

export default function SiteMapPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-[var(--text-primary)]">
      <h1 className="text-3xl font-bold mb-2">Site Map</h1>
      <p className="text-sm opacity-70 mb-10">
        All pages available on PixelGamez.
      </p>

      {sections.map((section) => (
        <section key={section.title} className="mb-10">
          <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
          <ul className="space-y-2">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-red-500 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
