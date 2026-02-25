<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  blok: any
}>()

// Support both lowercase and PascalCase property names from CMS
const body = computed(() => props.blok?.body || props.blok?.Body || [])
</script>

<template>
  <div v-if="blok" v-editable="blok" class="w-full">
    <StoryblokComponent 
      v-for="(nestedBlok, index) in body" 
      :key="nestedBlok._uid" 
      :blok="nestedBlok"
      :index="index"
      :isLast="index === body.length - 1"
    />
  </div>
</template>
