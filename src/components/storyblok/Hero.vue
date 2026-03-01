<script setup lang="ts">
import type { HeroBlok } from '../../types/storyblok'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import heroVideo from '../../assets/videos/hero-video.mp4'

const props = defineProps<{
  blok: HeroBlok
}>()

const route = useRoute()
const isHome = route.name === 'home' || route.path === '/'
const isServices = route.name === 'services' || route.path === '/services'
const isContact = route.name === 'contact' || route.path === '/contact'
const isWork = route.name === 'work' || route.path === '/work'

const headline = computed(() => {
  let val = props.blok?.headline || (props.blok as any)?.Headline || ''
  return val.replace(/Sonda Studio(?!s)/gi, 'Sonda Studios')
})

const subheadline = computed(() => {
  const text = props.blok?.subheadline || (props.blok as any)?.Subheadline || ''
  return text.replace(/(\s*)(Now live\.)/i, '\n$2')
})

const buttons = computed(() => props.blok?.buttons || (props.blok as any)?.Buttons || [])

const getLink = (link: any) => {
  if (!link) return '#'
  let url = '#'
  if (link.linktype === 'story') {
    url = link.cached_url ? `/${link.cached_url}` : '#'
  } else {
    url = link.url || '#'
  }

  // Force scroll to form for contact links
  if (url === '/contact' || url === '/contact/') {
    return '/contact#contact-form'
  }

  return url
}

const scrollToDiscover = () => {
  const el = document.getElementById('01')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const homeHeroRoot = ref<HTMLElement | null>(null)
const hasScrolledDown = ref(false)

const handleHomeScroll = () => {
  hasScrolledDown.value = window.scrollY > 24
}

const scrollToNextSection = () => {
  const nextSection = homeHeroRoot.value?.nextElementSibling as HTMLElement | null
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }

  window.scrollTo({
    top: window.scrollY + window.innerHeight,
    behavior: 'smooth'
  })
}

onMounted(() => {
  if (!isHome) return

  handleHomeScroll()
  window.addEventListener('scroll', handleHomeScroll, { passive: true })
})

onUnmounted(() => {
  if (!isHome) return
  window.removeEventListener('scroll', handleHomeScroll)
})
</script>

<template>
  <div v-if="blok" ref="homeHeroRoot" v-editable="blok" class="w-full text-app-text transition-colors duration-500">

    <!-- ========== HOME PAGE HERO ========== -->
    <div v-if="isHome" class="relative">
      <!-- Video Section (100svh) - pure visual hero -->
      <section class="relative h-screen h-[100svh] overflow-hidden bg-app-bg">
        <div class="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <video
            :src="heroVideo"
            class="absolute inset-0 w-full h-full object-cover"
            autoplay
            loop
            muted
            playsinline
          ></video>
        </div>

        <button
          type="button"
          aria-label="Scroll down"
          class="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-3 text-app-text/70 transition-all duration-500 hover:text-app-text focus-visible:outline-none"
          :class="hasScrolledDown ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'"
          @click="scrollToNextSection"
        >
          <span class="text-2xs tracking-[0.28em] uppercase">Scroll</span>
          <span class="relative block h-14 w-px overflow-hidden rounded-full bg-app-text/25">
            <span class="hero-scroll-segment absolute left-1/2 top-0 block h-5 w-px -translate-x-1/2 rounded-full bg-app-text"></span>
          </span>
        </button>
      </section>
    </div>

    <!-- ========== CONTACT PAGE HERO (original layout) ========== -->
    <template v-if="isContact">
      <section class="relative flex p-8 md:p-16 min-h-screen items-end justify-start text-left bg-app-bg">
        <div class="relative z-10 w-full max-w-7xl mx-auto">
          <h1 
            class="text-7xl md:text-8xl lg:text-display-giant font-normal mb-0 leading-[0.9]"
            :style="{ fontFamily: 'var(--font-sans)', color: 'inherit' }"
          >
            {{ headline }}
          </h1>
        </div>
      </section>
      <section class="w-full bg-app-bg p-8 md:p-16 text-left">
        <div class="max-w-7xl mx-auto flex flex-col items-start text-left">
          <p v-if="subheadline" class="text-lg md:text-xl text-app-text/60 font-light max-w-2xl leading-relaxed mb-10 tracking-normal whitespace-pre-line">
            {{ subheadline }}
          </p>
          <div v-if="buttons && buttons.length" class="flex flex-wrap items-center justify-start gap-8">
            <template v-for="(button, index) in buttons.slice(0, 2)" :key="button._uid">
              <router-link 
                :to="getLink(button.link || (button as any).Link)"
                :class="[
                  index === 0 ? 'button-primary' : 'button-secondary'
                ]"
              >
                {{ button.label || (button as any).Label || 'Discover' }}
              </router-link>
            </template>
          </div>
        </div>
      </section>
    </template>

    <template v-if="isServices || isWork">
      <section 
        class="relative flex overflow-hidden p-8 md:p-16 min-h-[70vh] flex-col items-center justify-start text-center pt-[25vh] md:pt-[30vh] pb-32 md:pb-48 bg-app-bg"
      >
        <div 
          class="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center"
        >
          <h1 
            class="text-7xl md:text-8xl lg:text-display-giant font-normal mb-0 leading-[0.9]"
            :style="{ fontFamily: 'var(--font-sans)', color: 'inherit' }"
          >
            {{ headline }}
          </h1>
          
          <p v-if="subheadline" class="text-lg md:text-xl text-app-text/60 font-light max-w-2xl leading-relaxed mt-6 tracking-normal whitespace-pre-line">
            {{ subheadline }}
          </p>
          <div class="flex flex-wrap items-center justify-center gap-8 mt-10">
            <a href="#" @click.prevent="scrollToDiscover" class="button-primary">Discover</a>
            <router-link to="/contact#contact-form" class="button-secondary">Contact us</router-link>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
@keyframes hero-scroll-segment-motion {
  0% {
    transform: translate(-50%, -120%);
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  70% {
    opacity: 1;
  }

  100% {
    transform: translate(-50%, 260%);
    opacity: 0;
  }
}

.hero-scroll-segment {
  animation: hero-scroll-segment-motion 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .hero-scroll-segment {
    animation: none;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}
</style>
