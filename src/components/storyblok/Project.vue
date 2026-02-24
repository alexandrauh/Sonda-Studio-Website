<script setup lang="ts">
import type { ProjectBlok } from '../../types/storyblok'
import { computed } from 'vue'

const props = defineProps<{
  blok: ProjectBlok
}>()

const title = computed(() => props.blok?.title || (props.blok as any)?.Title || '')
const category = computed(() => props.blok?.category || (props.blok as any)?.Category || '')
const image = computed(() => props.blok?.image || (props.blok as any)?.Image)
</script>

<template>
  <div v-if="blok" v-editable="blok" class="relative group overflow-hidden aspect-[3/4] bg-app-text/5">
    <img v-if="image?.filename" :src="image.filename" :alt="image.alt || (image as any).Alt" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
    <div class="absolute inset-0 bg-app-bg/90 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-center p-12 text-center shadow-2xl">
      <span class="text-3xs tracking-extra-wide text-app-text/40 mb-4">{{ category }}</span>
      <h3 class="text-3xl font-normal text-app-text font-serif">{{ title }}</h3>
    </div>
  </div>
</template>
