import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            alias: '/home',
            name: 'home',
            component: HomeView
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/services',
            name: 'services',
            component: () => import('../views/ServicesView.vue')
        },
        {
            path: '/portfolio',
            name: 'portfolio',
            component: () => import('../views/PortfolioView.vue')
        },
        {
            path: '/clients',
            name: 'clients',
            component: () => import('../views/ClientsView.vue')
        },
        {
            path: '/contact',
            name: 'contact',
            component: () => import('../views/ContactView.vue')
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        if (to.hash) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        el: to.hash,
                        behavior: 'smooth'
                    })
                }, 400) // Wait for Suspense/Storyblok to mount
            })
        }
        return { top: 0 }
    }
})

export default router
