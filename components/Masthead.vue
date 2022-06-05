<script setup>
const hidenotifaction = useCookie('statusbar');
hidenotifaction.value = hidenotifaction.value || false

function closeStatusBar() {
  hidenotifaction.value = true
}

</script>

<template>
  <header class="g-mb">
    <div v-if="!hidenotifaction" class="notification">
      <div class="notification__inner-wrapper g-px">
        <span>
          Are you a representative of one of these stores? 
          <NuxtLink to="/lets-work-together">Lets work together! 🤝</NuxtLink>
        </span>
        
        <img @click="closeStatusBar" src="~assets/svg/icon-x.svg" />
      </div>
    </div>
    <section class="g-px">
      <div class="nav-bar">
        <NuxtLink to="/">
           <h1 class="mdd:text-center">Mechstores App</h1>
        </NuxtLink>
        <div class="nav-bar__buttons">
          <NuxtLink class="button" to="mailto:info@mindsweep.online">
            <img src="~assets/svg/icon-send.svg" />
            <span>Give me feedback</span>
          </NuxtLink>
          <NuxtLink class="button" to="https://www.paypal.com/donate/?hosted_button_id=SSVPDTR2E8U22" target="_blank">
            <img src="~assets/svg/icon-unicorn.svg" />
            <span>Unicorn fund</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </header>
</template>