<script setup lang="ts">
import { useStoryblokContent } from '../composables/useStoryblokContent'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const story = await useStoryblokContent('services')

const activeSection = ref(0)
const totalSections = ref(0)

const updateActiveSection = () => {
  const sections = document.querySelectorAll('main section')
  const vh = window.innerHeight
  
  let current = 0
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect()
    // If the top edge has crossed the center of the screen
    if (rect.top <= vh * 0.5) {
      current = index
    }
  })
  activeSection.value = current
}

onMounted(async () => {
  await nextTick()
  const sections = document.querySelectorAll('main section')
  totalSections.value = sections.length
  
  window.addEventListener('scroll', updateActiveSection, { passive: true })
  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
})

const scrollToSection = (index: number) => {
  const sections = document.querySelectorAll('main section')
  if (sections[index]) {
    sections[index].scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <main class="relative min-h-screen bg-app-bg text-app-text transition-colors duration-500">
    <StoryblokComponent v-if="story?.content" :blok="story.content" />
    
    <div v-else class="min-h-screen flex flex-col items-center justify-center p-24 text-app-text/20 uppercase tracking-[1em] text-sm animate-pulse font-serif transition-colors duration-500">
      Sonda Studios
    </div>

    <!-- Dot Navigation indicator -->
    <div v-if="totalSections > 1" 
         class="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-50 transition-opacity duration-700 pointer-events-none"
         :class="activeSection === 0 ? 'opacity-0' : 'opacity-100 pointer-events-auto'"
    >
      <!-- Animated line connecting the dots -->
      <div class="absolute left-1/2 -translate-x-1/2 top-1.5 bottom-1.5 w-[1px] bg-brand-sand/20 z-0"></div>
      
      <!-- Moving active dot -->
      <div 
        class="absolute w-3 h-3 rounded-full bg-[var(--color-brand-cream)] border-[1.5px] border-[var(--color-brand-brown)] transition-all duration-700 pointer-events-none z-20 shadow-md scale-125 box-border"
        :style="{ top: `${Math.max(0, activeSection - 1) * 36}px` }"
      ></div>

      <button 
        v-for="index in Math.max(0, totalSections - 1)" 
        :key="index"
        @click="scrollToSection(index)"
        class="w-3 h-3 rounded-full transition-all duration-500 relative z-10 box-border pointer-events-auto"
        :class="[
          activeSection === index 
            ? 'opacity-0 scale-125' 
            : 'bg-brand-sand hover:bg-brand-sand/80 opacity-100 hover:scale-110'
        ]"
        :aria-label="`Scroll to service ${index}`"
        :aria-current="activeSection === index ? 'true' : 'false'"
      />
    </div>

    <!-- Sticky Contact CTA -->
    <router-link 
      to="/contact#contact-form"
      class="fixed bottom-12 right-12 md:bottom-16 md:right-16 lg:bottom-20 lg:right-20 z-50 button-secondary transition-all duration-700 ease-in-out hover:scale-105 shadow-xl"
      :class="activeSection > 0 ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'"
    >
      Contact us
    </router-link>
  </main>
</template>
