<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  blok: any
}>()

const items = computed(() => props.blok?.items || [])

const cols = ref(3)

const updateCols = () => {
  if (window.innerWidth >= 1024) {
    cols.value = 3
  } else if (window.innerWidth >= 640) {
    cols.value = 2
  } else {
    cols.value = 1
  }
}

const getAspectRatio = (asset: any) => {
  if (!asset?.filename) return 1
  // Storyblok image URLs contain dimensions: /f/space_id/widthxheight/hash/filename
  const match = asset.filename.match(/\/f\/\d+\/(\d+)x(\d+)\//)
  if (match) {
    const width = parseInt(match[1], 10)
    const height = parseInt(match[2], 10)
    if (width > 0) return height / width
  }
  // Default fallback if we can't find dimensions (e.g., video without thumbnail)
  return 1
}

const columnItems = computed(() => {
  const result: Array<Array<{item: any, globalIndex: number}>> = Array.from({ length: cols.value }, () => [])
  const colHeights = new Array(cols.value).fill(0)

  items.value.forEach((item: any, index: number) => {
    let asset = item.media
    if (asset?.filename?.match(/\.(mp4|webm|ogg|m4v|mov)$/i) && item.thumbnail?.filename) {
      asset = item.thumbnail
    }
    
    const heightRatio = getAspectRatio(asset)
    
    let minColIndex = 0
    let minHeight = colHeights[0]
    for (let i = 1; i < cols.value; i++) {
      // Use < to prefer the leftmost column if heights are exactly equal
      if (colHeights[i] < minHeight) {
        minHeight = colHeights[i]
        minColIndex = i
      }
    }
    
    const col = result[minColIndex]
    if (col) {
      col.push({ item, globalIndex: index })
      colHeights[minColIndex] += heightRatio
    }
  })
  
  return result
})

// Lightbox state
const isLightboxOpen = ref(false)
const currentIndex = ref(0)
const playerVideoRef = ref<HTMLVideoElement | null>(null)

const currentItem = computed(() => items.value[currentIndex.value])

const openLightbox = (index: number | string) => {
  currentIndex.value = Number(index)
  isLightboxOpen.value = true
  document.body.style.overflow = 'hidden' // Prevent scrolling
}

const closeLightbox = () => {
  isLightboxOpen.value = false
  document.body.style.overflow = ''
  if (playerVideoRef.value) {
    playerVideoRef.value.pause()
  }
}

const nextItem = () => {
  if (currentIndex.value < items.value.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0 // loop around
  }
}

const prevItem = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = items.value.length - 1
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!isLightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextItem()
  if (e.key === 'ArrowLeft') prevItem()
}

onMounted(() => {
  updateCols()
  window.addEventListener('resize', updateCols)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateCols)
  window.removeEventListener('keydown', handleKeydown)
})

// Video Hover Playback Logic
const handleMouseEnter = (event: MouseEvent) => {
  const video = (event.target as HTMLElement).querySelector('video')
  if (video) {
    video.play().catch(() => {})
  }
}

const handleMouseLeave = (event: MouseEvent) => {
  const video = (event.target as HTMLElement).querySelector('video')
  if (video) {
    video.pause()
    // Reset to beginning if preferred, or leave it where it paused
  }
}

const isVideo = (filename: string) => {
  return filename?.match(/\.(mp4|webm|ogg|m4v|mov)$/i)
}

const getMediaSrc = (asset: any) => {
  return asset?.filename || ''
}
</script>

<template>
  <section
    v-if="blok"
    v-editable="blok"
    class="w-full bg-app-bg text-app-text px-8 md:px-16 pt-4 md:pt-8 pb-20 md:pb-28 transition-colors duration-500"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header section similar to InstagramReels -->
      <div v-if="blok.headline || blok.intro" class="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
        <p v-if="blok.kicker" class="text-xs tracking-[0.2em] uppercase mb-4 opacity-70">{{ blok.kicker }}</p>
        <h2 v-if="blok.headline" class="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">{{ blok.headline }}</h2>
        <p v-if="blok.intro" class="text-lg md:text-xl opacity-80 font-light">{{ blok.intro }}</p>
      </div>

      <!-- Masonry Grid with flex columns to ensure round-robin placement -->
      <div v-if="items.length" class="flex gap-6 md:gap-8 items-start">
        <div v-for="(col, colIdx) in columnItems" :key="colIdx" class="flex flex-col gap-6 md:gap-8 flex-1">
          <div
            v-for="({item, globalIndex}) in col"
            :key="item._uid"
            class="relative group cursor-pointer overflow-hidden rounded-none bg-app-bg/40 border border-app-text/10 masonry-item"
            :style="{ '--index': globalIndex }"
            @click="openLightbox(globalIndex)"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <!-- Using StoryblokComponent for editing support, but we handle click here -->
            <StoryblokComponent :blok="item" />
          </div>
        </div>
      </div>
      <p v-else class="text-center text-app-text/60 text-sm md:text-base font-light">
        Grid items will appear here once they are added in Storyblok.
      </p>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isLightboxOpen"
          class="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm transition-opacity duration-300"
          @click="closeLightbox"
        >
          <button
            @click.stop="closeLightbox"
            class="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-[210] transition-colors cursor-pointer"
            aria-label="Close Lightbox"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            v-if="items.length > 1"
            @click.stop="prevItem"
            class="absolute left-4 md:left-8 text-white/50 hover:text-white p-2 z-[210] transition-colors cursor-pointer group outline-none"
            aria-label="Previous Item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 md:h-12 md:w-12 drop-shadow-lg transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Centered Media Content -->
          <div class="max-w-[70vw] max-h-[90vh] w-full flex items-center justify-center transition-all duration-300 relative z-[205]">
            <template v-if="currentItem">
              <div v-if="isVideo(currentItem.media?.filename)" class="w-full h-full flex items-center justify-center">
                <video
                  ref="playerVideoRef"
                  :src="getMediaSrc(currentItem.media)"
                  :poster="getMediaSrc(currentItem.thumbnail)"
                  controls
                  autoplay
                  class="max-h-[85vh] max-w-full rounded-none shadow-2xl object-contain bg-black"
                  @click.stop
                ></video>
              </div>
              <div v-else class="w-full h-full flex items-center justify-center">
                <img
                  :src="getMediaSrc(currentItem.media)"
                  :alt="currentItem.media?.alt || currentItem.media?.name || 'Portfolio image'"
                  class="max-h-[85vh] max-w-full rounded-none shadow-2xl object-contain"
                  @click.stop
                />
              </div>
            </template>
          </div>

          <button
            v-if="items.length > 1"
            @click.stop="nextItem"
            class="absolute right-4 md:right-8 text-white/50 hover:text-white p-2 z-[210] transition-colors cursor-pointer group outline-none"
            aria-label="Next Item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 md:h-12 md:w-12 drop-shadow-lg transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.masonry-item {
  opacity: 0;
  transform: translateY(40px);
  animation: itemReveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: calc(0.1s + (var(--index) * 0.1s));
}

@keyframes itemReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
