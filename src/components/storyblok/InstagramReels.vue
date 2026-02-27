<script setup lang="ts">
import { computed } from 'vue'
import type { InstagramReelItemBlok, InstagramReelsBlok } from '../../types/storyblok'

const props = defineProps<{
  blok: InstagramReelsBlok
}>()

interface ReelCard {
  uid: string
  title: string
  url: string
  imageSrc: string
  imageAlt: string
}

const defaultProfileUrl = 'https://www.instagram.com/_sondastudios_/'
const defaultKicker = 'Latest Reels'
const defaultHeadline = 'Latest Reels'
const defaultProfileLabel = 'View Instagram'

const pick = <T = unknown>(source: Record<string, any> | undefined, keys: string[]): T | undefined => {
  if (!source) return undefined
  for (const key of keys) {
    const value = source[key]
    if (value !== undefined && value !== null) {
      return value as T
    }
  }
  return undefined
}

const normalizeExternalUrl = (value: string): string => {
  const candidate = value.trim()
  if (!candidate) return ''
  if (/^https?:\/\//i.test(candidate)) return candidate
  if (candidate.startsWith('//')) return `https:${candidate}`
  if (/^[\w.-]+\.[a-z]{2,}(?:\/.*)?$/i.test(candidate)) return `https://${candidate}`
  return ''
}

const resolveLink = (rawLink: unknown): string => {
  if (!rawLink) return ''

  if (typeof rawLink === 'string') {
    return normalizeExternalUrl(rawLink)
  }

  if (typeof rawLink === 'object') {
    const link = rawLink as Record<string, any>
    const directUrl = typeof link.url === 'string' ? normalizeExternalUrl(link.url) : ''
    if (directUrl) return directUrl

    const cachedUrl = typeof link.cached_url === 'string' ? normalizeExternalUrl(link.cached_url) : ''
    if (cachedUrl) return cachedUrl
  }

  return ''
}

const isInstagramReelUrl = (value: string): boolean => {
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase()
    if (!host.endsWith('instagram.com')) return false

    const segments = url.pathname.split('/').filter(Boolean)
    const [firstSegment, secondSegment] = segments
    return firstSegment?.toLowerCase() === 'reel' && Boolean(secondSegment)
  } catch {
    return false
  }
}

const kicker = computed(() => {
  return String(pick(props.blok as any, ['kicker', 'Kicker']) || defaultKicker)
})

const headline = computed(() => {
  return String(pick(props.blok as any, ['headline', 'Headline']) || defaultHeadline)
})

const intro = computed(() => {
  return String(pick(props.blok as any, ['intro', 'Intro']) || '')
})

const profileLink = computed(() => {
  const fromCms = resolveLink(
    pick(props.blok as any, ['profile_link', 'profileLink', 'Profile_link', 'ProfileLink'])
  )
  return fromCms || defaultProfileUrl
})

const profileLabel = computed(() => {
  return String(
    pick(props.blok as any, ['profile_label', 'profileLabel', 'Profile_label', 'ProfileLabel']) ||
      defaultProfileLabel
  )
})

const reels = computed(() => {
  return (
    pick<InstagramReelItemBlok[]>(props.blok as any, ['reels', 'Reels']) || []
  ).filter(Boolean)
})

const cards = computed<ReelCard[]>(() => {
  return reels.value
    .map((item, index) => {
      const url = resolveLink(
        pick(item as any, ['reel_link', 'reelLink', 'Reel_link', 'ReelLink'])
      )

      if (!isInstagramReelUrl(url)) {
        return null
      }

      const title = String(pick(item as any, ['title', 'Title']) || `Reel ${index + 1}`)
      const thumbnail = pick<Record<string, any>>(item as any, ['thumbnail', 'Thumbnail']) || {}
      const imageSrc = typeof thumbnail.filename === 'string' ? thumbnail.filename : ''
      const imageAltFromAsset = typeof thumbnail.alt === 'string' ? thumbnail.alt : ''
      const imageAltFromField =
        String(
          pick(item as any, ['thumbnail_alt', 'thumbnailAlt', 'Thumbnail_alt', 'ThumbnailAlt']) || ''
        ).trim() || ''
      const imageAlt = imageAltFromField || imageAltFromAsset || title

      return {
        uid: String(item?._uid || `${index}-${url}`),
        title,
        url,
        imageSrc,
        imageAlt
      }
    })
    .filter((value): value is ReelCard => Boolean(value))
})
</script>

<template>
  <section
    v-if="blok"
    id="01"
    v-editable="blok"
    class="w-full bg-app-bg text-app-text px-8 md:px-16 py-20 md:py-28 transition-colors duration-500"
  >
    <div class="max-w-7xl mx-auto">
      <header class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 md:gap-12 mb-12 md:mb-16">
        <div class="max-w-4xl">
          <p class="text-3xs uppercase tracking-extra-wide text-app-text/45 mb-5">
            {{ kicker }}
          </p>
          <h2 class="text-5xl md:text-7xl lg:text-display-giant leading-[0.9]">
            {{ headline }}
          </h2>
          <p v-if="intro.trim()" class="mt-6 max-w-3xl text-base md:text-lg text-app-text/70 font-light leading-relaxed">
            {{ intro }}
          </p>
        </div>

        <a
          :href="profileLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center self-start lg:self-end border border-app-text/20 px-6 py-3 text-2xs uppercase tracking-extra-wide text-app-text/80 transition-all duration-500 hover:bg-app-text hover:text-app-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-app-text"
        >
          {{ profileLabel }}
        </a>
      </header>

      <ul v-if="cards.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10" aria-label="Instagram reels">
        <li v-for="card in cards" :key="card.uid">
          <a
            :href="card.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`Open ${card.title} on Instagram`"
            class="group block rounded-[1.5rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-app-text"
          >
            <article class="h-full overflow-hidden border border-app-text/10 bg-app-bg/40 transition-transform duration-500 group-hover:-translate-y-1">
              <div class="aspect-[9/16] overflow-hidden bg-app-text/5">
                <img
                  v-if="card.imageSrc"
                  :src="card.imageSrc"
                  :alt="card.imageAlt"
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center px-8 text-center text-3xs uppercase tracking-extra-wide text-app-text/40"
                  aria-hidden="true"
                >
                  Instagram Reel
                </div>
              </div>
              <div class="p-5 md:p-6 flex items-center justify-between gap-5">
                <h3 class="text-lg md:text-xl leading-tight text-app-text/95">
                  {{ card.title }}
                </h3>
                <span class="text-2xs uppercase tracking-extra-wide text-app-text/50 transition-colors duration-500 group-hover:text-app-text">
                  View Reel
                </span>
              </div>
            </article>
          </a>
        </li>
      </ul>

      <p v-else class="text-app-text/60 text-sm md:text-base font-light">
        Reels will appear here once they are added in Storyblok.
      </p>
    </div>
  </section>
</template>
