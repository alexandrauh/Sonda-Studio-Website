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
    if (segments.length < 2) return false
    
    if (segments[0]?.toLowerCase() === 'reel') return true
    if (segments[1]?.toLowerCase() === 'reel') return true

    return false
  } catch {
    return false
  }
}



const reels = computed(() => {
  return (
    pick<InstagramReelItemBlok[]>(props.blok as any, ['reels', 'Reels']) || []
  ).filter(Boolean)
})

const cards = computed<ReelCard[]>(() => {
  return reels.value
    .map((item, index) => {
      let url = resolveLink(
        pick(item as any, ['reel_link', 'reelLink', 'Reel_link', 'ReelLink'])
      )

      if (!isInstagramReelUrl(url)) {
        return null
      }

      // Force the reel to open in the context of the Sonda Studios profile
      // This prevents Instagram from auto-playing random unrelated reels
      try {
        const urlObj = new URL(url)
        const segments = urlObj.pathname.split('/').filter(Boolean)
        let reelId = ''
        
        if (segments[0]?.toLowerCase() === 'reel') {
          reelId = segments[1] || ''
        } else if (segments[1]?.toLowerCase() === 'reel') {
          reelId = segments[2] || ''
        }
        
        if (reelId) {
          urlObj.pathname = `/_sondastudios_/reel/${reelId}/`
          url = urlObj.toString()
        }
      } catch (e) {
        // Fallback to original url if parsing fails
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
    class="w-full bg-app-bg text-app-text px-8 md:px-16 pt-4 md:pt-8 pb-20 md:pb-28 transition-colors duration-500"
  >
    <div class="max-w-7xl mx-auto">
      <ul v-if="cards.length" class="flex flex-wrap justify-center gap-8 md:gap-10" aria-label="Instagram reels">
        <li v-for="(card, index) in cards" :key="card.uid" class="w-full max-w-[267px] reel-card" :style="{ '--index': index }">
          <a
            :href="card.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`Open ${card.title} on Instagram`"
            class="group block rounded-[1.5rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-app-text"
          >
            <article class="h-full overflow-hidden border border-app-text/10 bg-app-bg/40 transition-transform duration-500 group-hover:-translate-y-1">
              <div class="aspect-[382/680] overflow-hidden bg-app-text/5">
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

<style scoped>
.reel-card {
  opacity: 0;
  transform: translateY(40px);
  animation: reelReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: calc(0.1s + (var(--index) * 0.15s));
}

@keyframes reelReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

