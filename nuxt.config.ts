import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    css: ["@/assets/css/styles.pcss"],
    build: {
        postcss: {
            postcssOptions: require("./postcss.config.js"),
        },
        //transpile: ['@/vendor/mixitup.js', '@/vendor/mixitup-multifilter.js']
    },
    buildModules: ['@pinia/nuxt'],
    alias: {
        'mixitup': '@/vendor/mixitup.js'
    }
})