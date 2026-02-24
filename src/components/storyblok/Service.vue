<script setup lang="ts">
import type { ServiceBlok } from '../../types/storyblok'
import { computed } from 'vue'

const props = defineProps<{
  blok: ServiceBlok
}>()

const title = computed(() => props.blok?.title || (props.blok as any)?.Title || '')
const description = computed(() => props.blok?.description || (props.blok as any)?.Description || '')
const icon = computed(() => props.blok?.icon || (props.blok as any)?.Icon || 'span')
</script>

<template>
  <div v-if="blok" v-editable="blok" class="group p-10 border-b border-app-text/10 hover:bg-app-text/5 transition-all duration-700">
    <div class="mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
      <component :is="icon" class="w-6 h-6 text-app-text" />
    </div>
    <h3 class="text-3xl font-normal mb-6 text-app-text font-serif">{{ title }}</h3>
    <p class="text-app-text/70 leading-relaxed font-light whitespace-pre-line">{{ description }}</p>
  </div>
</template>
