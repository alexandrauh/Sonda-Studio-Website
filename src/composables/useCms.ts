import { ref, onMounted } from 'vue'
import type { ISbStoryData } from '@storyblok/vue'
import { useStoryblokContent } from './useStoryblokContent'

export function useCms(slug: string, options = {}) {
    const story = ref<ISbStoryData | null>(null)

    onMounted(async () => {
        try {
            const storyData = await useStoryblokContent(slug, options)
            story.value = storyData.value
        } catch (error) {
            console.error(`Error loading Storyblok content for ${slug}:`, error)
        }
    })

    return { story }
}
