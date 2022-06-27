<script setup>
defineProps({
    store: Object
})
</script>

<template>
    <a class="card" :class="store.region.slug" :href="store.url" target="_blank">
        <article class="store-snippet">
            <span v-if="store.country" class="store-snippet__country">{{ store.country }}</span>
            <div class="store-snippet__image-wrapper">
                <img v-if="store.logo" :alt="`image for ${store.title}`" :src="store.logo">
            </div>
            <h2 class="store-snippet__title">{{ store.title }}</h2>
            <div class="store-snippet__products">
                <span v-for="(product, index) in store.shopProducts" :key="index">
                    {{ product.title }}
                </span>
            </div>
        </article>
    </a>
</template>