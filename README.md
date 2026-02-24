# Sonda Studio Website

A premium portfolio website for Sonda Studio, a full-service media agency specializing in video content, PR, and social media management.

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **Headless CMS**: [Storyblok](https://www.storyblok.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd "Sonda Studio Website"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add your Storyblok Preview Token:
   ```env
   VITE_STORYBLOK_TOKEN=your_preview_token_here
   ```

### Development

Run the development server:
```bash
npm run dev
```

### Build

Build the project for production:
```bash
npm run build
```

The build assets will be generated in the `dist/` folder.

## Project Structure

- `src/views/`: Individual page components (About, Services, Portfolio, etc.).
- `src/components/`: Reusable UI components.
- `src/router/`: Routing configuration.
- `src/stores/`: Pinia state management modules.
- `src/style.css`: Global styles and Tailwind CSS v4 initialization.

## Development Standards

This project follows the standards defined in [.agent/instructions.md](.agent/instructions.md), prioritizing the Composition API, strict TypeScript, and a mobile-first responsive design.

## CMS Integration

We use Storyblok for content management. Clients can manage:
- Video content and portfolios
- Service listings
- Testimonials and client logos
- General agency information

To see live previews in Storyblok, ensure the development server is running and configured as the preview URL in your Storyblok space settings.
