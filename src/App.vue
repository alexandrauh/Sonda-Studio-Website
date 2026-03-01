<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'

const isMenuOpen = ref(false)
const isScrolled = ref(false)
const isHeaderVisible = ref(true)
const lastScrollY = ref(0)
const route = useRoute()

const isHome = computed(() => route.name === 'home' || route.path === '/')

const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  // Set scrolled state
  if (currentScrollY > 50) {
    isScrolled.value = true
  } else {
    isScrolled.value = false
  }

  // Handle header visibility
  if (currentScrollY < lastScrollY.value || currentScrollY <= 50) {
    // Scrolling up or at the top
    isHeaderVisible.value = true
  } else if (currentScrollY > lastScrollY.value && currentScrollY > 50) {
    // Scrolling down (and not at the very top)
    if (!isMenuOpen.value) {
      isHeaderVisible.value = false
    }
  }
  
  lastScrollY.value = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(isMenuOpen, (val) => {
  if (val) {
    document.body.classList.add('menu-open')
  } else {
    document.body.classList.remove('menu-open')
  }
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const navLinks = [
  // { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/work', label: 'Work' },
  // { path: '/portfolio', label: 'Portfolio' },
  // { path: '/clients', label: 'Clients' },
  { path: '/contact', label: 'Contact' }
]
</script>

<template>
  <header 
    :class="[
      'fixed w-full z-[100] border-b transition-all duration-500 ease-in-out',
      isHome && !isScrolled ? 'bg-transparent border-transparent' : 'bg-app-bg border-app-text/5',
      isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
    ]"
  >
    <nav class="max-w-7xl mx-auto px-6 flex justify-between items-center h-24 md:h-28">
      <RouterLink 
        to="/" 
        @click="closeMenu" 
        class="h-12 md:h-16 lg:h-20 z-50 transition-transform active:scale-95"
        aria-label="Sonda Studios Home"
      >
        <img src="/logo-dark.png" alt="Sonda Studios" class="h-full w-auto object-contain" />
      </RouterLink>
      
      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center gap-10" role="navigation" aria-label="Main Navigation">
        <RouterLink 
          v-for="link in navLinks" 
          :key="link.path" 
          :to="link.path" 
          class="text-sm font-normal hover:opacity-50 transition-all tracking-[0.1em] text-app-text"
        >
          {{ link.label }}
        </RouterLink>
        
      </div>

      <div class="flex items-center gap-4 md:hidden">
        <button 
          @click="toggleMenu" 
          class="relative w-12 h-12 flex flex-col justify-center items-center gap-2 z-[110] focus:outline-none"
          aria-label="Toggle mobile menu"
          :aria-expanded="isMenuOpen"
        >
          <span class="w-8 h-[1px] bg-app-text transition-all duration-500" :class="{ 'rotate-45 translate-y-[4.5px]': isMenuOpen }"></span>
          <span class="w-8 h-[1px] bg-app-text transition-all duration-500" :class="{ '-rotate-45 -translate-y-[4.5px]': isMenuOpen }"></span>
          <span class="sr-only">{{ isMenuOpen ? 'Close Menu' : 'Open Menu' }}</span>
        </button>
      </div>
    </nav>
  </header>

  <Transition name="fade-overlay">
    <div v-if="isMenuOpen" @click="closeMenu" class="fixed inset-0 z-40 md:hidden bg-app-text/20 backdrop-blur-[2px]"></div>
  </Transition>

  <Transition name="slide">
    <div v-if="isMenuOpen" class="fixed top-0 right-0 h-full w-[85%] z-50 md:hidden bg-app-bg border-l border-app-text/5 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.1)] transition-colors duration-500">
      <div class="flex-grow flex flex-col justify-between p-10 pt-32 pb-12 overflow-y-auto">
        <div class="flex flex-col gap-8">
          <RouterLink 
            v-for="(link, index) in navLinks" 
            :key="link.path" 
            :to="link.path" 
            @click="closeMenu"
            class="text-3xl sm:text-4xl font-normal text-app-text leading-none hover:translate-x-4 transition-transform duration-500"
            :style="{ transitionDelay: `${index * 50}ms` }"
          >
            {{ link.label }}
          </RouterLink>
        </div>
        
        <div class="mt-12 flex-grow flex flex-col justify-end">
          <div class="pt-10 border-t border-app-text/10">
            <p class="text-[10px] text-app-text/40 uppercase tracking-[0.4em] mb-8">Connect</p>
            <div class="flex items-center gap-8">
              <a href="https://www.instagram.com/_sondastudios_/" target="_blank" rel="noopener noreferrer" class="group text-app-text/60 hover:text-app-text transition-all" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-50 group-hover:opacity-100 transition-opacity"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.tiktok.com/@sondastudios_" target="_blank" rel="noopener noreferrer" class="group text-app-text/60 hover:text-app-text transition-all" aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-50 group-hover:opacity-100 transition-opacity"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
              <a href="https://www.facebook.com/share/1KM2h6kD3X/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" class="group text-app-text/60 hover:text-app-text transition-all" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-50 group-hover:opacity-100 transition-opacity"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="mailto:info@sondastudios.com" class="group text-app-text/60 hover:text-app-text transition-all" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="opacity-50 group-hover:opacity-100 transition-opacity"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <div class="flex flex-col min-h-screen w-full relative">
    <main class="flex-grow w-full flex flex-col relative">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <Suspense>
            <component :is="Component" />
            <template #fallback>
              <div class="flex-grow bg-[#1a1818] flex items-center justify-center transition-colors duration-500 min-h-screen">
                <div class="w-10 h-10 border border-app-text/10 border-t-[#ebe7e0] rounded-full animate-spin"></div>
              </div>
            </template>
          </Suspense>
        </transition>
      </RouterView>
    </main>

    <footer class="shrink-0 w-full bg-app-bg px-8 md:px-16 py-12 text-center relative overflow-hidden transition-colors duration-500">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-wrap justify-center items-center gap-10">
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
    </footer>
  </div>
</template>

<style>
/* Transitions */
.slide-enter-active, .slide-leave-active { transition: all 0.6s cubic-bezier(0.82, 0.01, 0.15, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
.fade-overlay-enter-active, .fade-overlay-leave-active { transition: opacity 0.6s ease; }
.fade-overlay-enter-from, .fade-overlay-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

body.menu-open { overflow: hidden; }
img { max-width: 100%; }
</style>
