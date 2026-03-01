<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  startDate?: string
  daysToAnimate?: number
}>()

const baseDate = new Date('2014-02-25T00:00:00Z')

const calculateDays = () => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - baseDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const targetNumber = ref(calculateDays())
const displayNumber = ref(0)
const counterRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
let hasAnimated = false

const paddedDigits = computed(() => {
  const str = String(displayNumber.value).padStart(4, '0')
  return str.split('')
})

const startAnimation = () => {
  const start = 0
  const end = targetNumber.value
  const duration = 2000
  const startTime = performance.now()

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    const easeOutStr = 1 - Math.pow(1 - progress, 3)
    displayNumber.value = Math.floor(start + (end - start) * easeOutStr)

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      displayNumber.value = end
    }
  }

  requestAnimationFrame(animate)
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting && !hasAnimated) {
      hasAnimated = true
      startAnimation()
    }
  }, { threshold: 0.25 })

  if (counterRef.value) {
    observer.observe(counterRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="w-full flex flex-col items-center justify-center pt-4 pb-8" ref="counterRef">
    
    <!-- Top Text -->
    <span class="text-xs md:text-sm tracking-[0.2em] uppercase text-app-text/70 font-light mb-6 md:mb-8">
      We've poured
    </span>

    <!-- Flip Cards Container (Tighter gap for compactness) -->
    <div class="flex flex-row justify-center gap-1.5 md:gap-3 lg:gap-4 mb-6 md:mb-8">
      
      <!-- Individual Digit Card (Brown background, narrower width) -->
      <div 
        v-for="(digit, index) in paddedDigits" 
        :key="index"
        class="relative w-[3.5rem] md:w-[4.5rem] lg:w-[6rem] h-[5rem] md:h-[6.5rem] lg:h-[8.5rem] bg-app-bg border border-brand-sand rounded-lg shadow-sm flex flex-col justify-center items-center"
      >
        <!-- Top Calendar Rings (solid brand-sand border and bg-app-bg fill) -->
        <div class="absolute -top-[0.5rem] md:-top-[0.6rem] left-[20%] w-[0.35rem] md:w-[0.4rem] h-4 md:h-5 border-[1.5px] border-brand-sand rounded-full bg-app-bg z-20"></div>
        <div class="absolute -top-[0.5rem] md:-top-[0.6rem] right-[20%] w-[0.35rem] md:w-[0.4rem] h-4 md:h-5 border-[1.5px] border-brand-sand rounded-full bg-app-bg z-20"></div>

        <!-- Horizontal Split Line -->
        <div class="absolute top-1/2 left-0 w-full h-[1px] bg-brand-sand transform -translate-y-1/2 z-0 opacity-50 pointer-events-none"></div>

        <!-- Overflow hidden wrapper for slot-machine transition -->
        <div class="relative w-full h-full overflow-hidden flex justify-center items-center z-10">
          <Transition name="flip-roll">
            <span :key="digit" class="absolute text-[3rem] md:text-[4rem] lg:text-[5.5rem] font-light leading-none tracking-tighter text-app-text bg-app-bg px-2 pt-2 md:pt-3 lg:pt-4">
              {{ digit }}
            </span>
          </Transition>
        </div>
        
      </div>

    </div>

    <!-- Bottom Text -->
    <span class="text-xs md:text-sm tracking-[0.2em] uppercase text-app-text/70 font-light text-center px-4 max-w-sm">
      Days into mastering the art of storytelling
    </span>

  </div>
</template>

<style scoped>
/* A rapid sliding transition to mimic flipping/rolling cards when the digits change rapidly */
.flip-roll-enter-active,
.flip-roll-leave-active {
  transition: transform 0.05s ease-in-out, opacity 0.05s ease-in-out;
}
.flip-roll-enter-from {
  transform: translateY(40%);
  opacity: 0;
}
.flip-roll-leave-to {
  transform: translateY(-40%);
  opacity: 0;
}
</style>
