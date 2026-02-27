<script setup lang="ts">
import type { FeatureBlok } from '../../types/storyblok'
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  blok: FeatureBlok
  index?: number
  isLast?: boolean
}>()

const sectionRef = ref<HTMLElement | null>(null)
const parallaxY = ref(0)
const textOpacity = ref(1)

const handleScroll = () => {
  if (!sectionRef.value) return
  
  // Find absolute Y position of section inside document flow
  let offset = 0
  let curr = sectionRef.value as HTMLElement | null
  while (curr) {
    offset += curr.offsetTop
    curr = curr.offsetParent as HTMLElement | null
  }
  
  const vh = window.innerHeight
  const currentScroll = window.scrollY
  const scrolledPast = currentScroll - offset
  
  // Parallax begins as the section enters its sticky state or while scrolling through it
  if (scrolledPast > 0) {
    const maxScroll = vh * 1.17
    const progress = Math.min(1, Math.max(0, scrolledPast / maxScroll))
    
    parallaxY.value = props.isLast ? 0 : progress * 150
    textOpacity.value = props.isLast ? 1 : Math.max(0, 1 - progress * 1.8)
  } else {
    parallaxY.value = 0
    textOpacity.value = 1
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const title = computed(() => {
  let val = props.blok?.title || (props.blok as any)?.Title || ''
  return val.replace(/Sonda Studio(?!s)/gi, 'Sonda Studios')
})
const text = computed(() => props.blok?.text || (props.blok as any)?.Text || '')

const formattedIndex = computed(() => {
  if (typeof props.index === 'undefined') return ''
  // Change from index + 1 to just index to make it start at 01 if it was 02 previously
  return (props.index).toString().padStart(2, '0')
})

const isSecondary = computed(() => {
  if (typeof props.index === 'undefined') return false
  // Since index starts at 1, '01' will be 1 % 2 !== 0. This makes it secondary styled.
  return Number(formattedIndex.value) % 2 !== 0
})
</script>

<template>
  <section v-if="blok" v-editable="blok" 
    class="sticky top-0 w-full block overflow-hidden transition-colors duration-500 reveal-on-scroll"
    :class="[
      isSecondary ? 'bg-[var(--color-brand-cream)] text-[var(--color-brand-brown)]' : 'bg-app-bg text-app-text',
      isLast ? 'h-[100vh]' : 'h-[117vh]'
    ]"
    :id="formattedIndex"
    ref="sectionRef"
  >
    <div 
      class="h-screen w-full flex flex-col justify-center px-8 transition-transform duration-75 ease-out will-change-transform"
      :style="{ transform: `translateY(${parallaxY}px)`, opacity: textOpacity }"
    >
      <div class="max-w-5xl mx-auto w-full relative">
        <div v-if="formattedIndex && title.trim()" aria-hidden="true" class="absolute -top-12 md:-top-16 left-0 opacity-20 font-sans text-xl md:text-2xl lg:text-3xl tracking-widest">
           {{ formattedIndex }}
        </div>
        <div class="relative w-full" v-if="title.trim()">
          <h2 class="text-6xl md:text-8xl lg:text-[6rem] font-normal mb-16 leading-[1.1] tracking-tighter relative inline-block"
              :class="[isSecondary ? 'text-[var(--color-brand-brown)]' : 'text-app-text']">
            <div 
              class="absolute top-[0.55em] right-[100%] w-[100vw] h-[1px] opacity-30 mr-8 md:mr-10"
              :class="[isSecondary ? 'bg-[var(--color-brand-brown)]' : 'bg-brand-sand']"
            ></div>
            {{ title }}
          </h2>
        </div>
      
      <div class="max-w-3xl">
        <template v-for="(line, index) in text.split('\n')" :key="index">
          <div v-if="line.trim().startsWith('-')" class="flex items-start gap-4 mb-4 pl-2 group">
            <span class="mt-2.5 w-1.5 h-1.5 rotate-45 shrink-0 transition-transform duration-500 group-hover:scale-150"
                  :class="[isSecondary ? 'bg-[var(--color-brand-brown)]' : 'bg-brand-sand']"></span>
            <p class="text-lg md:text-xl font-light tracking-wide leading-relaxed"
               :class="[isSecondary ? 'text-[var(--color-brand-brown)]/80' : 'text-app-text/70']">
              {{ line.trim().substring(1).trim() }}
            </p>
          </div>
          <p v-else-if="line.trim()" class="text-lg md:text-xl leading-relaxed mb-12 font-light tracking-wide"
             :class="[isSecondary ? 'text-[var(--color-brand-brown)]/80' : 'text-app-text/70']">
            {{ line.trim() }}
          </p>
        </template>
      </div>
    </div>
    </div>
  </section>
</template>

<style scoped>
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  animation: reveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h2 {
  font-family: var(--font-sans);
}
</style>
