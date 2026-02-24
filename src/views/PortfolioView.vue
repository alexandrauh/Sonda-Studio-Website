<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'

const story = await useStoryblok('portfolio', { version: 'draft' })
</script>

<template>
  <main class="min-h-screen bg-app-bg text-app-text transition-colors duration-500">
    <StoryblokComponent v-if="story?.content" :blok="story.content" />
    
    <div v-else class="min-h-screen flex flex-col items-center justify-center p-24 text-app-text/20 uppercase tracking-[1em] text-sm animate-pulse font-serif transition-colors duration-500">
      Sonda Studios
    </div>
  </main>
</template>
