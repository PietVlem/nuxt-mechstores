import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    target: 'static',
    runtimeConfig: {
        public: {
            MINDSWEEP_API_BASEURL: process.env.MINDSWEEP_API_BASEURL,
        }
    },
    css: ["@/assets/css/styles.pcss"],
    build: {
        postcss: {
            postcssOptions: require("./postcss.config.js"),
        },
    },
    ssr: false
})