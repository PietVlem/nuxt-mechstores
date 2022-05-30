<script>

const route = useRoute()

useHead({
  title: `Mechstores App - ${route.meta.title}`,
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  charset: 'utf-8',
  meta: [
    { name: 'description', content: 'Overview of websites from all over the world where you can buy parts for your mechanical keyboard.' },
    { name: 'keywords', content: 'Mechanical Keyboard Stores App Filter' },
    { name: 'author', content: 'mindsweep.be' },
    { name: 'copyright', content: 'mindsweep.be 2022' },
    { name: 'HandheldFriendly', content: 'true' },
    { property: 'og:site_name', content: 'Mechanical Keyboard Stores App' },
    { property: 'og:title', content: "Mechanical Keyboard Stores App - Find the websites for the best parts to build your mechanical keyboard." },
    { property: 'og:description', content: 'Overview of websites from all over the world where you can buy parts for your mechanical keyboard.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://mechstores.mindsweep.be' },
    { name: 'robots', content: 'index,follow' }
  ]
})
</script>

<template>
  <Masthead></Masthead>
  <slot />
  <Footer></Footer>
</template>