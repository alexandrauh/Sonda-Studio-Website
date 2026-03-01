import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { StoryblokVue, apiPlugin } from '@storyblok/vue'
import App from './App.vue'
import router from './router'
import './style.css'

import Page from './components/storyblok/Page.vue'
import Hero from './components/storyblok/Hero.vue'
import Feature from './components/storyblok/Feature.vue'
import Service from './components/storyblok/Service.vue'
import Project from './components/storyblok/Project.vue'
import ContactForm from './components/storyblok/ContactForm.vue'
import Testimonial from './components/storyblok/Testimonial.vue'
import AboutSection from './components/storyblok/AboutSection.vue'
import ConnectSection from './components/storyblok/ConnectSection.vue'
import FallbackComponent from './components/storyblok/FallbackComponent.vue'
import InstagramReels from './components/storyblok/InstagramReels.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Storyblok components map
const components = {
    page: Page,
    Page: Page,
    hero: Hero,
    Hero: Hero,
    feature: Feature,
    Feature: Feature,
    service: Service,
    Service: Service,
    project: Project,
    Project: Project,
    contact_form: ContactForm,
    ContactForm: ContactForm,
    testimonial: Testimonial,
    Testimonial: Testimonial,
    instagram_reels: InstagramReels,
    InstagramReels: InstagramReels,
    Instagram_Reels: InstagramReels,
    about_section: AboutSection,
    AboutSection: AboutSection,
    connect_section: ConnectSection,
    ConnectSection: ConnectSection,
    fallback: FallbackComponent,
    Fallback: FallbackComponent
}

// Explicitly register as global components to ensure visibility
Object.entries(components).forEach(([name, component]) => {
    app.component(name, component)
})

app.use(StoryblokVue, {
    accessToken: import.meta.env.VITE_STORYBLOK_TOKEN,
    use: [apiPlugin],
    components
})

app.mount('#app')
