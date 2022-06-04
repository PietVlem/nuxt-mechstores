<script setup>
import { useCookies } from "vue3-cookies"
const { cookies } = useCookies();

/*Satus bar*/
const showStatusBar = ref(true)
function closeStatusBar() {
  cookies.set(`status`, 'hidden', '7d')
  showStatusBar.value = false
}

onMounted(() => {
  let my_cookie_value = cookies.get("status");
  if (my_cookie_value) showStatusBar.value = false
})
</script>

<template>
  <header class="g-mb">
    <div v-if="showStatusBar" class="notification">
      <div class="notification__inner-wrapper g-px">
        <span>
          Are you a representative of one of these stores? <a class="link" href="#">Lets work together! 🤝</a>
        </span>
        <img @click="closeStatusBar" src="~assets/svg/icon-x.svg" />
      </div>
    </div>
    <section class="g-px">
      <div class="nav-bar">
        <a href="#">
          <h1 class="mdd:text-center">Mechstores App</h1>
        </a>
        <div class="nav-bar__buttons">
          <a class="button" href="mailto:info@mindsweep.online">
            <img src="~assets/svg/icon-send.svg" />
            <span>Give me feedback</span>
          </a>
          <a class="button" href="https://www.paypal.com/donate/?hosted_button_id=SSVPDTR2E8U22" target="_blank">
            <img src="~assets/svg/icon-unicorn.svg" />
            <span>Unicorn fund</span>
          </a>
        </div>
      </div>
    </section>
  </header>
</template>