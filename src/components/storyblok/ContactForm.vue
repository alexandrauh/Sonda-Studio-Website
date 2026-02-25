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

const adjustHeight = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = `${target.scrollHeight}px`
}
</script>

<template>
  <div id="contact-form" v-if="blok" v-editable="blok" class="w-full bg-brand-cream text-brand-brown py-20 px-6 md:px-12 lg:px-24 transition-colors duration-500">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-4xl md:text-5xl font-normal mb-12 md:mb-16 text-brand-brown">{{ title }}</h2>
      
      <div v-if="submitSuccess" class="p-6 mb-8 bg-green-100 border border-green-500/30 text-green-800 font-light rounded-sm tracking-wide">
        Thank you for your message. We will reach out to you shortly.
      </div>
      
      <div v-if="submitError" class="p-6 mb-8 bg-red-100 border border-red-500/30 text-red-800 font-light rounded-sm tracking-wide">
        There was an error submitting the form. Please try again later.
      </div>

      <form @submit.prevent="handleSubmit" name="contact" data-netlify="true" netlify-honeypot="bot-field" class="space-y-10" v-if="!submitSuccess">
        <input type="hidden" name="form-name" value="contact" />
        
        <p class="hidden">
          <label>Don’t fill this out if you're human: <input name="bot-field" v-model="form.botField" /></label>
        </p>

        <div class="group py-2">
          <label for="name" class="block text-xs font-light text-brand-brown mb-2 tracking-label uppercase transition-colors">Full Name</label>
          <div class="relative border-b border-brand-brown">
            <input id="name" v-model="form.name" type="text" name="name" autocomplete="name" class="w-full bg-transparent text-brand-brown focus:outline-none py-2 font-light peer" required :disabled="isSubmitting" />
            <div class="absolute bottom-[-1px] left-0 w-full h-[2px] bg-brand-brown transform scale-x-0 origin-left transition-transform duration-300 peer-focus:scale-x-100"></div>
          </div>
        </div>
        <div class="group py-2">
          <label for="email" class="block text-xs font-light text-brand-brown mb-2 tracking-label uppercase transition-colors">Email Address</label>
          <div class="relative border-b border-brand-brown">
            <input id="email" v-model="form.email" type="email" name="email" autocomplete="email" class="w-full bg-transparent text-brand-brown focus:outline-none py-2 font-light peer" required :disabled="isSubmitting" />
            <div class="absolute bottom-[-1px] left-0 w-full h-[2px] bg-brand-brown transform scale-x-0 origin-left transition-transform duration-300 peer-focus:scale-x-100"></div>
          </div>
        </div>
        <div class="group py-2">
          <label for="message" class="block text-xs font-light text-brand-brown mb-2 tracking-label uppercase transition-colors">Your Message</label>
          <div class="relative border-b border-brand-brown">
            <textarea id="message" v-model="form.message" name="message" rows="1" class="w-full bg-transparent text-brand-brown focus:outline-none py-2 font-light resize-none overflow-hidden peer" required :disabled="isSubmitting" @input="adjustHeight"></textarea>
            <div class="absolute bottom-[-1px] left-0 w-full h-[2px] bg-brand-brown transform scale-x-0 origin-left transition-transform duration-300 peer-focus:scale-x-100"></div>
          </div>
        </div>
        <button type="submit" class="w-full py-6 bg-brand-brown text-brand-cream font-light uppercase tracking-widest-marketing transition-all border-2 border-transparent hover:bg-brand-sand hover:text-brand-cream hover:border-transparent cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-brown outline-none disabled:opacity-50 disabled:cursor-not-allowed" :disabled="isSubmitting">
          {{ isSubmitting ? 'Sending...' : 'Send' }}
        </button>
      </form>
    </div>
  </div>
</template>
