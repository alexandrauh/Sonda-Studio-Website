<script setup lang="ts">
import { reactive, computed } from 'vue'
import type { ContactFormBlok } from '../../types/storyblok'

const props = defineProps<{
  blok: ContactFormBlok
}>()

const title = computed(() => {
  let val = props.blok?.title || (props.blok as any)?.Title || 'Contact Us'
  return val.replace(/Sonda Studio(?!s)/gi, 'Sonda Studios')
})

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = () => {
  console.log('Form submitted:', form)
  alert('Thank you for your message. We will reach out to you shortly.')
}
</script>

<template>
  <div v-if="blok" v-editable="blok" class="max-w-3xl mx-auto p-8 md:p-12 lg:p-24 bg-app-text/5 transition-colors duration-500">
    <h2 class="text-4xl md:text-5xl font-normal mb-12 md:mb-16 text-app-text">{{ title }}</h2>
    <form @submit.prevent="handleSubmit" class="space-y-10">
      <div class="group py-2">
        <label for="name" class="block text-3xs font-light text-app-text/40 mb-2 tracking-label uppercase group-focus-within:text-app-text transition-colors">Full Name</label>
        <div class="border-b border-app-text/20 group-focus-within:border-app-text transition-colors">
          <input id="name" v-model="form.name" type="text" autocomplete="name" class="w-full bg-transparent text-app-text focus:outline-none py-2 font-light" required />
        </div>
      </div>
      <div class="group py-2">
        <label for="email" class="block text-3xs font-light text-app-text/40 mb-2 tracking-label uppercase group-focus-within:text-app-text transition-colors">Email Address</label>
        <div class="border-b border-app-text/20 group-focus-within:border-app-text transition-colors">
          <input id="email" v-model="form.email" type="email" autocomplete="email" class="w-full bg-transparent text-app-text focus:outline-none py-2 font-light" required />
        </div>
      </div>
      <div class="group py-2">
        <label for="message" class="block text-3xs font-light text-app-text/40 mb-2 tracking-label uppercase group-focus-within:text-app-text transition-colors">Your Message</label>
        <div class="border-b border-app-text/20 group-focus-within:border-app-text transition-colors">
          <textarea id="message" v-model="form.message" rows="4" class="w-full bg-transparent text-app-text focus:outline-none py-2 font-light resize-none" required></textarea>
        </div>
      </div>
      <button type="submit" class="w-full py-6 button-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-app-text outline-none">
        Send Inquiry
      </button>
    </form>
  </div>
</template>
