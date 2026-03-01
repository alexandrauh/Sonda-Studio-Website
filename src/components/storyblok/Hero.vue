<script setup lang="ts">
import type { HeroBlok } from '../../types/storyblok'
import { computed, ref, onMounted } from 'vue'
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

const animationReady = ref(false)
onMounted(() => {
  // Small delay ensures the browser paints the initial opacity:0 state
  // before we transition to visible, so the animation is actually seen
  setTimeout(() => {
    animationReady.value = true
  }, 300)
})
</script>

<template>
  <div v-if="blok" v-editable="blok" class="w-full text-app-text transition-colors duration-500">

    <!-- ========== HOME PAGE HERO ========== -->
    <div v-if="isHome" class="relative">
      <!-- Video Section (90vh) - Now the pure hero -->
      <section class="relative h-[90vh] overflow-hidden bg-app-bg">
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
/* Fade-in animation for potential future use or consistency */
.hero-word {
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-word-visible {
  opacity: 1;
}
</style>
