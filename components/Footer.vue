<script setup>
const year = ref('')
year.value = new Date().getFullYear()
</script>

<template>
  <footer class="g-px">
    <div class="credits row-xl">
      <div class="credits__pages">
        <a class="link" href="/cookies">Cookies</a>
        <a class="link" href="/lets-work-together">Let's work together</a>
      </div>
      <div class="credits__copy">
        <span>© Copyright {{ year }}, <a class="link" href="https://mindsweep.online/">mindsweep.online</a></span>
      </div>
      <div class="credits__inspired">
        <span>Theme inspired by: <a class="link" href="https://draculatheme.com/"
            target="_blank">Draculatheme</a></span>
      </div>
    </div>
  </footer>
</template>