<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  blok: any
}>()

const isVideo = computed(() => {
  const filename = props.blok.media?.filename || ''
  return filename.match(/\.(mp4|webm|ogg|m4v|mov)$/i)
})

const mediaSrc = computed(() => props.blok.media?.filename || '')
const thumbnailSrc = computed(() => props.blok.thumbnail?.filename || '')
const altText = computed(() => props.blok.media?.alt || props.blok.media?.name || '')
</script>

<template>
  <div v-editable="blok" class="w-full h-full relative" aria-label="Portfolio item">
    <template v-if="isVideo">
      <!-- Muted autoplay video for grid -->
      <video
        :src="mediaSrc"
        :poster="thumbnailSrc"
        muted
        loop
        playsinline
        class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
      ></video>
      <!-- Video Icon Overlay -->
      <div class="absolute top-4 right-4 bg-[#2c2020]/50 backdrop-blur-md text-white p-2 rounded-full opacity-80 group-hover:opacity-100 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
        </svg>
      </div>
    </template>
    <template v-else>
      <img
        :src="mediaSrc"
        :alt="altText"
        loading="lazy"
        class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
      />
    </template>
  </div>
</template>
