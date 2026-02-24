<script setup lang="ts">
import type { TestimonialBlok } from '../../types/storyblok'
import { computed } from 'vue'

const props = defineProps<{
  blok: TestimonialBlok
}>()

const quote = computed(() => props.blok?.quote || (props.blok as any)?.Quote || '')
const authorName = computed(() => props.blok?.author_name || (props.blok as any)?.Author_name || (props.blok as any)?.author_name || '')
const authorRole = computed(() => props.blok?.author_role || (props.blok as any)?.Author_role || (props.blok as any)?.author_role || '')
const authorImage = computed(() => props.blok?.author_image || (props.blok as any)?.Author_image)
</script>

<template>
  <div v-if="blok" v-editable="blok" class="p-16 text-center border-t border-app-text/5">
    <p class="text-3xl md:text-4xl font-normal leading-[1.2] mb-12 italic text-app-text/90 font-serif quotation-mark">
      {{ quote }}
    </p>
    <div class="flex flex-col items-center gap-4">
      <div v-if="authorImage?.filename" class="w-16 h-16 rounded-full overflow-hidden border border-app-text/10 mb-2">
        <img :src="authorImage.filename" :alt="authorName" class="w-full h-full object-cover grayscale" />
      </div>
      <div>
        <h4 class="font-normal text-app-text tracking-label text-3xs">{{ authorName }}</h4>
        <p class="text-2xs text-app-text/40 tracking-label mt-1">{{ authorRole }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.quotation-mark::before {
  content: '“';
  font-family: serif;
  display: block;
  font-size: 3.75rem;
  line-height: 1;
  color: var(--color-app-text);
  opacity: 0.1;
  margin-bottom: 1rem;
}
</style>
