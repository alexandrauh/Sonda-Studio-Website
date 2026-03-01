<script setup lang="ts">
import { useStoryblokContent } from '../composables/useStoryblokContent'

const story = await useStoryblokContent('home')
</script>

<template>
  <main class="min-h-screen bg-app-bg text-app-text transition-colors duration-500">
    <template v-if="story?.content">
      <StoryblokComponent :blok="story.content" />
    </template>
    
    <div v-else class="min-h-screen flex flex-col items-center justify-center p-24">
      <div class="w-12 h-12 border border-app-text/10 border-t-app-text rounded-full animate-spin mb-8 transition-colors duration-500"></div>
    </div>
  </main>
</template>
