<script setup lang="ts">
import type { FeatureBlok } from '../../types/storyblok'
import { computed } from 'vue'

const props = defineProps<{
  blok: FeatureBlok
  index?: number
}>()

const title = computed(() => {
  let val = props.blok?.title || (props.blok as any)?.Title || ''
  return val.replace(/Sonda Studio(?!s)/gi, 'Sonda Studios')
})
const text = computed(() => props.blok?.text || (props.blok as any)?.Text || '')
const reverse = computed(() => props.blok?.reverse || (props.blok as any)?.Reverse || false)
const image = computed(() => props.blok?.image || (props.blok as any)?.Image)

const formattedIndex = computed(() => {
  if (typeof props.index === 'undefined') return ''
  return (props.index + 1).toString().padStart(2, '0')
})
</script>

<template>
  <section v-if="blok" v-editable="blok" class="py-24 md:py-64 px-8 bg-app-bg transition-colors duration-500 reveal-on-scroll">
    <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 md:gap-32 items-center text-left">
      <div :class="{ 'md:order-2': reverse }" class="relative">
        <div v-if="formattedIndex" aria-hidden="true" class="absolute -top-12 md:-top-16 left-0 text-app-text/20 font-sans text-xs md:text-sm tracking-widest">
          {{ formattedIndex }}
        </div>
        <h2 class="text-6xl md:text-8xl lg:text-[10rem] font-normal mb-16 text-app-text leading-[0.8] tracking-tighter">
          {{ title }}
        </h2>
        
        <div class="max-w-xl">
          <template v-for="(line, index) in text.split('\n')" :key="index">
            <div v-if="line.trim().startsWith('-')" class="flex items-start gap-4 mb-4 pl-2 group">
              <span class="mt-2.5 w-1.5 h-1.5 rotate-45 bg-brand-sand shrink-0 group-hover:scale-150 transition-transform duration-500"></span>
              <p class="text-lg md:text-xl text-app-text/70 font-light tracking-wide leading-relaxed">{{ line.trim().substring(1).trim() }}</p>
            </div>
            <p v-else-if="line.trim()" class="text-lg md:text-xl text-app-text/70 leading-relaxed mb-12 font-light tracking-wide italic">
              {{ line.trim() }}
            </p>
          </template>
        </div>
      </div>
      
      <div 
        :class="{ 'md:order-1': reverse }" 
        class="aspect-[3/4] bg-app-text/5 overflow-hidden transition-all duration-1000 grayscale hover:grayscale-0 relative group"
      >
        <img v-if="image?.filename" :src="image.filename" :alt="image.alt || (image as any).Alt" class="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
        <div v-else class="w-full h-full flex items-center justify-center text-app-text/10 tracking-widest text-xs uppercase">
          Studio Perspective
        </div>
        <div class="absolute inset-0 bg-app-text/5 mix-blend-multiply opacity-20"></div>
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
