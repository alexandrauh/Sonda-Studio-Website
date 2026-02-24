<script setup lang="ts">
import type { HeroBlok } from '../../types/storyblok'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import heroVideo from '../../assets/videos/hero-video.mp4'

const props = defineProps<{
  blok: HeroBlok
}>()

const route = useRoute()
const isHome = route.name === 'home' || route.path === '/'

const headline = computed(() => {
  let val = props.blok?.headline || (props.blok as any)?.Headline || ''
  return val.replace(/Sonda Studio(?!s)/gi, 'Sonda Studios')
})

const subheadline = computed(() => props.blok?.subheadline || (props.blok as any)?.Subheadline || '')
const buttons = computed(() => props.blok?.buttons || (props.blok as any)?.Buttons || [])

const getLink = (link: any) => {
  if (!link) return '#'
  if (link.linktype === 'story') {
    return link.cached_url ? `/${link.cached_url}` : '#'
  }
  return link.url || '#'
}
</script>

<template>
  <div v-if="blok" v-editable="blok" class="w-full text-app-text transition-colors duration-500">
    <!-- Hero Video Section -->
    <section class="min-h-screen relative flex items-end justify-start p-8 md:p-16 overflow-hidden bg-app-bg">
      <video
        v-if="isHome"
        :src="heroVideo"
        class="absolute inset-0 w-full h-full object-cover z-0"
        autoplay
        loop
        muted
        playsinline
      ></video>
      <div class="relative z-10 w-full max-w-7xl mx-auto text-left">
        <h1 
          class="text-7xl md:text-8xl lg:text-display-giant font-normal mb-0 leading-[0.9]"
          :style="{ fontFamily: isHome ? 'var(--font-serif)' : 'var(--font-sans)', color: isHome ? '#ffffff' : 'inherit' }"
        >
          {{ headline }}
        </h1>
      </div>
    </section>

    <!-- Sub-headline & Buttons Section -->
    <section class="w-full bg-app-bg p-8 md:p-16">
      <div class="max-w-7xl mx-auto flex flex-col items-start text-left">
        <p v-if="subheadline" class="text-lg md:text-xl text-app-text/60 font-light max-w-2xl leading-relaxed mb-10 tracking-normal whitespace-pre-line">
          {{ subheadline }}
        </p>
        
        <div v-if="buttons && buttons.length" class="flex flex-wrap items-center gap-8">
          <template v-for="(button, index) in buttons.slice(0, 2)" :key="button._uid">
            <a 
              :href="getLink(button.link || (button as any).Link)"
              :class="[
                index === 0 ? 'button-primary' : 'button-secondary'
              ]"
            >
              {{ button.label || (button as any).Label || 'Discover' }}
            </a>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>
