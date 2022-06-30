<script setup>
defineProps({
    store: Object
})
</script>

<template>
    <a class="card" :class="store.region.slug" :href="store.url" target="_blank">
        <span v-if="store.country" class="card__country">{{ store.country }}</span>
        <div class="card__data">
            <div class="image-wrapper">
                <img v-if="store.logo" :alt="`image for ${store.title}`" :src="store.logo">
            </div>
            <div class="text">
                <h2 class="text__title">{{ store.title }}</h2>
                <div class="text__products">
                    <span v-for="(product, index) in store.shopProducts" :key="index">
                        {{ product.title }}
                    </span>
                </div>
            </div>
        </div>
    </a>
</template>