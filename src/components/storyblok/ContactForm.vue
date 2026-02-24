<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
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
  message: '',
  botField: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = false

  try {
    const formData = new URLSearchParams()
    formData.append('form-name', 'contact')
    formData.append('bot-field', form.botField)
    formData.append('name', form.name)
    formData.append('email', form.email)
    formData.append('message', form.message)

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData as any).toString()
    })

    if (response.ok) {
      submitSuccess.value = true
      form.name = ''
      form.email = ''
      form.message = ''
      form.botField = ''
    } else {
      throw new Error('Network response was not ok')
    }
  } catch (error) {
    console.error('Form submission error:', error)
    submitError.value = true
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div v-if="blok" v-editable="blok" class="max-w-3xl mx-auto p-8 md:p-12 lg:p-24 bg-app-text/5 transition-colors duration-500">
    <h2 class="text-4xl md:text-5xl font-normal mb-12 md:mb-16 text-app-text">{{ title }}</h2>
    
    <div v-if="submitSuccess" class="p-6 mb-8 bg-green-900/20 border border-green-500/30 text-green-300 font-light rounded-sm tracking-wide">
      Thank you for your message. We will reach out to you shortly.
    </div>
    
    <div v-if="submitError" class="p-6 mb-8 bg-red-900/20 border border-red-500/30 text-red-300 font-light rounded-sm tracking-wide">
      There was an error submitting the form. Please try again later.
    </div>

    <form @submit.prevent="handleSubmit" name="contact" data-netlify="true" netlify-honeypot="bot-field" class="space-y-10" v-if="!submitSuccess">
      <input type="hidden" name="form-name" value="contact" />
      
      <p class="hidden">
        <label>Don’t fill this out if you're human: <input name="bot-field" v-model="form.botField" /></label>
      </p>

      <div class="group py-2">
        <label for="name" class="block text-3xs font-light text-app-text/40 mb-2 tracking-label uppercase group-focus-within:text-app-text transition-colors">Full Name</label>
        <div class="border-b border-app-text/20 group-focus-within:border-app-text transition-colors">
          <input id="name" v-model="form.name" type="text" name="name" autocomplete="name" class="w-full bg-transparent text-app-text focus:outline-none py-2 font-light" required :disabled="isSubmitting" />
        </div>
      </div>
      <div class="group py-2">
        <label for="email" class="block text-3xs font-light text-app-text/40 mb-2 tracking-label uppercase group-focus-within:text-app-text transition-colors">Email Address</label>
        <div class="border-b border-app-text/20 group-focus-within:border-app-text transition-colors">
          <input id="email" v-model="form.email" type="email" name="email" autocomplete="email" class="w-full bg-transparent text-app-text focus:outline-none py-2 font-light" required :disabled="isSubmitting" />
        </div>
      </div>
      <div class="group py-2">
        <label for="message" class="block text-3xs font-light text-app-text/40 mb-2 tracking-label uppercase group-focus-within:text-app-text transition-colors">Your Message</label>
        <div class="border-b border-app-text/20 group-focus-within:border-app-text transition-colors">
          <textarea id="message" v-model="form.message" name="message" rows="4" class="w-full bg-transparent text-app-text focus:outline-none py-2 font-light resize-none" required :disabled="isSubmitting"></textarea>
        </div>
      </div>
      <button type="submit" class="w-full py-6 button-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-app-text outline-none disabled:opacity-50 disabled:cursor-not-allowed" :disabled="isSubmitting">
        {{ isSubmitting ? 'Sending...' : 'Send Inquiry' }}
      </button>
    </form>
  </div>
</template>
