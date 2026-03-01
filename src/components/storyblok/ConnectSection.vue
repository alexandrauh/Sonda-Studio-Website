<script setup lang="ts">
import type { ConnectSectionBlok } from '../../types/storyblok'

defineProps<{
  blok: ConnectSectionBlok
}>()
</script>

<template>
  <div v-if="blok" v-editable="blok" class="w-full bg-app-bg px-8 md:px-16 py-12 text-center relative overflow-hidden transition-colors duration-500">
    <div class="max-w-7xl mx-auto">
      <div 
        class="flex flex-wrap justify-center items-center gap-10"
        :class="[blok.show_divider ? 'pt-12 border-t border-app-text/10' : '']"
      >
        <p class="text-[10px] text-app-text/40 uppercase tracking-[0.4em] w-full mb-2">Connect</p>
        
        <a href="https://www.instagram.com/_sondastudios_/" target="_blank" rel="noopener noreferrer" class="group transition-all" aria-label="Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-app-text/60 group-hover:text-app-text transition-colors"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
        
        <a href="https://www.tiktok.com/@sondastudios_" target="_blank" rel="noopener noreferrer" class="group transition-all" aria-label="TikTok">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-app-text/60 group-hover:text-app-text transition-colors"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
        </a>
        
        <a href="https://www.facebook.com/share/1KM2h6kD3X/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" class="group transition-all" aria-label="Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-app-text/60 group-hover:text-app-text transition-colors"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        </a>

        <a href="mailto:info@sondastudios.com" class="group transition-all" aria-label="Email">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-app-text/60 group-hover:text-app-text transition-colors"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </a>
      </div>
    </div>
  </div>
</template>
