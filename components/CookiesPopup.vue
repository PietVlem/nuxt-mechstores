<script setup>
const hidePopupCookie = useCookie('cookie-popup');
hidePopupCookie.value = hidePopupCookie.value || false

function hidePopup() {
  hidePopupCookie.value = true
}
</script>

<template>
 <div v-if="!hidePopupCookie" class="cookies-popup">
    <div class="cookies-popup__inner-wrapper">
      <p>
          This site uses 
          <NuxtLink class="link" to="/cookies">cookies</NuxtLink>
      </p>
      <img @click="hidePopup" src="~assets/svg/icon-x.svg" />
    </div>
  </div>
</template>