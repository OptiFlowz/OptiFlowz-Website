import type { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

const baseUrl = 'https://optiflowz.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/about-us',
    '/attribution',
    '/blog',
    '/pricing',
    '/privacy-policy',
    '/services/custom-video-platform',
    '/services/web-design-and-development',
    '/services/business-automation',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const articlesPath = path.join(process.cwd(), 'articles')

  const articleRoutes = fs
    .readdirSync(articlesPath)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '')
      return {
        url: `${baseUrl}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }
    })

  const extraFiles = [
    {
      url: `${baseUrl}/OptiFlowz_Video_Corner_Pricing_Feb2026.pdf`,
      lastModified: new Date('2026-02-18T09:35:39+00:00'),
      priority: 0.64,
    },
  ]

  return [...staticRoutes, ...articleRoutes, ...extraFiles]
}