<template>
    <div class="border-black border-y-2 flex items-center h-12 sticky top-0 w-full z-10 bg-white">
        <div @click="$router.push(back)" class="cursor-pointer px-3 h-full border-r-2 flex items-center" :class="[$route.name === 'home' ? 'bg-green border-r-black' : 'border-r-transparent', 
        $route.name === 'my_collection' ? 'flex-1' : '']">
            <svg v-if="$route.name === 'home'" class="h-[26px] w-[26px] fill-black stroke-black stroke-[0.2]">
                <path
                    d="M0.4 13.8542V13.9542H0.5H6.32291H12.0458V18.8229V23.6916H7.17717H2.30837L2.30243 19.683L2.29634 15.5744L2.2962 15.4753L2.19709 15.4746L1.34892 15.4683L0.500746 15.4619L0.4 15.4612V15.5619V20.531V25.5V25.6H0.5H13H25.5H25.6V25.5V13V0.5V0.4H25.5H13H0.5H0.4V0.5V7.17709V13.8542ZM18.8269 13.9542H23.6916V15.9115V17.8687H19.6771H15.5626H15.4626V17.9687V18.8228V19.677V19.7768L15.5624 19.777L19.6709 19.783L23.6799 19.789L23.6858 21.7407L23.6916 23.6916H18.811H13.9301V18.839C13.9301 17.477 13.9319 16.2372 13.9348 15.3367C13.9363 14.8865 13.938 14.5212 13.9399 14.268C13.9409 14.1414 13.9419 14.043 13.9429 13.9761C13.943 13.973 13.943 13.9701 13.9431 13.9671C13.9461 13.9671 13.9491 13.967 13.9523 13.967C14.0193 13.966 14.1179 13.965 14.2449 13.964C14.4987 13.9621 14.8649 13.9604 15.3162 13.9589C16.2188 13.956 17.4617 13.9542 18.8269 13.9542ZM12.0458 7.17709V12.0458H7.17709H2.30837V7.17709V2.30837H7.17709H12.0458V7.17709ZM23.6857 6.56968C23.6874 7.7656 23.6868 8.85274 23.6846 9.64084C23.6836 10.0349 23.682 10.3541 23.6802 10.5747C23.6798 10.6158 23.6795 10.6535 23.6791 10.6876C23.6282 10.6374 23.566 10.576 23.4933 10.504C23.2701 10.2829 22.9484 9.96314 22.5521 9.56847C21.7595 8.77916 20.6687 7.69041 19.4711 6.49276L15.287 2.30861L19.4123 2.31434L23.6797 2.32027L23.6857 6.56968ZM18.1507 7.86137L22.335 12.0458H18.2033H13.9301V7.79066C13.9301 6.59309 13.9322 5.50445 13.9354 4.71525C13.9371 4.32063 13.939 4.00102 13.9412 3.78014C13.9416 3.73862 13.942 3.70063 13.9424 3.66631C13.9934 3.71653 14.0557 3.7781 14.1285 3.85022C14.3517 4.07128 14.6734 4.39103 15.0697 4.7857C15.8623 5.57501 16.953 6.66374 18.1507 7.86137Z" />
            </svg>
            <svg v-else class="w-[10px] h-[18px] ml-2 fill-none">
                <path d="M9 16.5L1.5 9L9 1.5"
                    class="stroke-2 stroke-black [stroke-linecap:round] [stroke-linejoin:round]" />
            </svg>
        </div>
        <h1 class="text-xl text-center grow">
            {{ $t($route.meta.title) }}
            <span v-if="$route.name === 'my_collection'">({{ count }})</span>
        </h1>
        <div class="flex-1 px-3 border-l-2 border-transparent text-right" v-if="$route.name === 'my_collection'">
            <button class="bg-green rounded-xl text-sm px-3 py-1 font-bold" @click="scroll('share')">
                {{ $t('Share') }}
            </button>
        </div>
        <FavouritesCount v-else class="border-l-2 border-l-transparent px-4 py-2" :show-tooltip="isActive" />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useItemsStore } from '../stores/ItemsStore'
import { useRoute } from 'vue-router'
import FavouritesCount from './FavouritesCount.vue';

const route = useRoute()
const itemsStore = useItemsStore()

const count = computed(() => itemsStore.count)
const isActive = ref(false)

const displayTooltip = () => {
    isActive.value = true
    setTimeout(() => {
        isActive.value = false
    }, 3000)
}

const scroll = (id) => {
    document.getElementById(id).scrollIntoView({
        behavior: 'smooth'
    })
}

itemsStore.$onAction(({ name: actionName }) => {
    if (actionName === 'add') {
        displayTooltip()
    }
})

const back = computed(() => route.meta.back?.(route) ?? { name: 'home' })
</script>
