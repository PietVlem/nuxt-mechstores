<script setup>
import { useCookies } from "vue3-cookies"
const { cookies } = useCookies();

/*Satus bar*/
const showPopup = ref(true)
function hidePopup() {
  cookies.set(`cookie-popup`, 'hidden', '7d')
  showPopup.value = false
}

onMounted(() => {
  let my_cookie_value = cookies.get("cookie-popup");
  if (my_cookie_value) showPopup.value = false
})
</script>

<template>
 <div v-if="showPopup" class="cookies-popup">
    <div class="cookies-popup__inner-wrapper">
      <p>This site uses <a class="link" href="/cookies">cookies</a></p>
      <img @click="hidePopup" src="~assets/svg/icon-x.svg" />
    </div>
  </div>
</template>