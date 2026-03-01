import { useStoryblok } from '@storyblok/vue'

type StoryblokVersion = 'draft' | 'published'
type StoryblokOptions = NonNullable<Parameters<typeof useStoryblok>[1]>

function isStoryblokVersion(value: string | undefined): value is StoryblokVersion {
    return value === 'draft' || value === 'published'
}

export function resolveStoryblokVersion(): StoryblokVersion {
    const explicitVersion = import.meta.env.VITE_STORYBLOK_VERSION
    if (isStoryblokVersion(explicitVersion)) {
        return explicitVersion
    }

    return import.meta.env.DEV ? 'draft' : 'published'
}

export function useStoryblokContent(slug: string, options: StoryblokOptions = {}) {
    return useStoryblok(slug, {
        ...options,
        version: resolveStoryblokVersion()
    })
}
