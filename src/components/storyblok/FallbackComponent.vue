<script setup lang="ts">
defineProps({
  blok: Object
})
</script>

<template>
  <div class="p-10 border-2 border-dashed border-red-500/50 text-red-500 rounded-2xl bg-red-500/5 text-center">
    <h3 class="font-bold mb-2 uppercase tracking-widest">Component Not Found</h3>
    <p class="text-xs opacity-70">The component <strong>"{{ blok?.component }}"</strong> is not registered in <code>main.ts</code>.</p>
  </div>
</template>
