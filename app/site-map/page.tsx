import type { Metadata } from 'next'
import Link from 'next/link'
import { Anton } from 'next/font/google'

const anton = Anton({ subsets: ['latin'], weight: '400' })

export const metadata: Metadata = {
  title: 'Site Map — PixelGamez',
  description: 'Browse all pages available on PixelGamez.',
}

const links: { href: string; label: string; description: string }[] = [
  {
    href: '/',
    label: 'Home',
    description: 'The main entry to PixelGamez, showcasing our latest and most played free browser games.',
  },
  {
    href: '/trending',
    label: 'Trending',
    description: 'See what games are picking up momentum with players right now.',
  },
  {
    href: '/new',
    label: 'New',
    description: 'The freshest games just added to the site.',
  },
  {
    href: '/popular',
    label: 'Popular',
    description: 'The most-played games on PixelGamez, all time.',
  },
  {
    href: '/up-and-coming',
    label: 'Up & Coming',
    description: 'Rising games worth keeping an eye on before they blow up.',
  },
  {
    href: '/most-visited',
    label: 'Most Visited',
    description: 'The games players keep coming back to.',
  },
  {
    href: '/recommended',
    label: 'Recommended',
    description: 'Picks tailored to what you like to play.',
  },
  {
    href: '/developer',
    label: 'Developer',
    description: 'Information for developers who want to submit or manage games on PixelGamez.',
  },
  {
    href: '/brand-integration',
    label: 'Brand Integration',
    description: 'Partnership and sponsorship opportunities for brands.',
  },
  {
    href: '/privacy-policy',
    label: 'Privacy Policy',
    description: 'How we collect, use, and protect your information.',
  },
  {
    href: '/terms-of-service',
    label: 'Terms of Service',
    description: 'The terms and conditions for using PixelGamez.',
  },
]

export default function SiteMapPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs md:text-sm font-bold tracking-[0.2em] text-teal-400 uppercase mb-4">
          / Navigation
        </p>
        <h1 className={`${anton.className} text-5xl md:text-7xl uppercase leading-[0.95] mb-16`}>
          Site Map
        </h1>

        {links.map((link, i) => (
          <div key={link.href}>
            {i > 0 && <div className="border-t border-white/10 my-10" />}
            <Link href={link.href} className="group block">
              <h2 className={`${anton.className} text-xl md:text-2xl uppercase mb-2 group-hover:text-teal-400 transition-colors`}>
                {link.label}
              </h2>
              <p className="text-sm md:text-base opacity-70 leading-relaxed">
                {link.description}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
