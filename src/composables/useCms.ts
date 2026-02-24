import { useStoryblok } from '@storyblok/vue'
import { ref, onMounted } from 'vue'
import type { ISbStoryData } from '@storyblok/vue'

export function useCms(slug: string, options = {}) {
    const story = ref<ISbStoryData | null>(null)

    onMounted(async () => {
        try {
            const storyData = await useStoryblok(slug, {
                version: 'draft',
                ...options
            })
            story.value = storyData.value
        } catch (error) {
            console.error(`Error loading Storyblok content for ${slug}:`, error)
        }
    })

    return { story }
}
