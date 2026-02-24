export interface StoryblokComponentBlok {
    _uid: string;
    component: string;
    [key: string]: any;
}

export interface PageBlok extends StoryblokComponentBlok {
    body: StoryblokComponentBlok[];
}

export interface HeroBlok extends StoryblokComponentBlok {
    headline: string;
    subheadline: string;
    buttons?: { _uid: string; label: string }[];
}

export interface FeatureBlok extends StoryblokComponentBlok {
    title: string;
    text: string;
    reverse?: boolean;
    image?: {
        filename: string;
        alt: string;
    };
}

export interface ServiceBlok extends StoryblokComponentBlok {
    title: string;
    description: string;
    icon?: string;
}

export interface ProjectBlok extends StoryblokComponentBlok {
    title: string;
    category: string;
    image: {
        filename: string;
        alt: string;
    };
}

export interface TestimonialBlok extends StoryblokComponentBlok {
    quote: string;
    author_name: string;
    author_role: string;
    author_image?: {
        filename: string;
        alt: string;
    };
}

export interface ContactFormBlok extends StoryblokComponentBlok {
    title: string;
}
