
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: 'pages/**/*.md',
      schema: z.object({
        lead: z.string().optional(),
        category: z.string().optional(),
      })
    }),
    emails: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        subject: z.string(),
        category: z.string().optional(),
        preview: z.string().optional(),
        rawbody: z.string()
      })
    })
  }
})
