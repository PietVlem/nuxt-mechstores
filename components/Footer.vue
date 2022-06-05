<script setup>
const year = ref('')
year.value = new Date().getFullYear()
</script>

<template>
  <footer class="g-px">
    <div class="credits row-xl">
      <div class="credits__pages">
        <NuxtLink class="link" to="/cookies">Cookies</NuxtLink>
        <NuxtLink class="link" to="/lets-work-together">Let's work together</NuxtLink>
      </div>
      <div class="credits__copy">
        <span>
          © Copyright {{ year }}, 
          <NuxtLink class="link" to="https://mindsweep.online/">mindsweep.online</NuxtLink>
        </span>
      </div>
      <div class="credits__inspired">
        <span>
          Theme inspired by: 
          <NuxtLink class="link" to="https://draculatheme.com/">Draculatheme</NuxtLink>
        </span>
      </div>
    </div>
  </footer>
</template>