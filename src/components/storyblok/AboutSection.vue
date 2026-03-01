<script setup lang="ts">
import type { AboutSectionBlok } from '../../types/storyblok'
import { computed } from 'vue'
import DaysCounter from '../DaysCounter.vue'

const props = defineProps<{
  blok: AboutSectionBlok
}>()

const headline = computed(() => {
  let val = props.blok?.headline || ''
  return val.replace(/Sonda Studio(?!s)/gi, 'Sonda Studios')
})

const paragraphs = computed(() => {
  let val = props.blok?.content || ''
  // Normalize spacing and newlines
  const text = val
    .replace(/Sonda Studio(?!s)/gi, 'Sonda Studios')
    .replace(/\\r\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\\n/g, '\n')
    .trim()
  
  return text.split(/\n+/).filter(p => p.trim() !== '')
})

const firstTwoParagraphs = computed(() => paragraphs.value.slice(0, 2))
const remainingParagraphs = computed(() => paragraphs.value.slice(2))
</script>

<template>
  <section v-if="blok" v-editable="blok" class="w-full bg-app-bg px-8 py-24 md:py-32 text-left relative overflow-hidden">
    <div class="max-w-5xl mx-auto">
      <!-- Headline styled like the services page (Feature component) -->
      <div class="relative w-full mb-16 md:mb-20">
        <h2 class="text-6xl md:text-8xl lg:text-[6rem] font-normal leading-[1.1] tracking-tighter relative inline-block text-app-text">
          <div 
            class="absolute top-[0.55em] right-[100%] w-[100vw] h-[1px] opacity-30 mr-8 md:mr-10 bg-brand-sand"
          ></div>
          {{ headline }}
        </h2>
      </div>

      <!-- Content with natural flow and paragraph break prevention -->
      <div class="columns-1 md:columns-2 gap-12 md:gap-24 text-lg md:text-xl text-app-text/70 font-light leading-relaxed tracking-wide">
        <p v-for="(p, i) in firstTwoParagraphs" :key="`p1-${i}`" class="mb-4">
          {{ p }}
        </p>

        <!-- Tightened margins directly around the flip calendar -->
        <DaysCounter class="break-inside-avoid mt-6 mb-[49px]" />

        <p v-for="(p, i) in remainingParagraphs" :key="`p2-${i}`" class="mb-6">
          {{ p }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
h2 {
  font-family: var(--font-sans);
}
</style>
