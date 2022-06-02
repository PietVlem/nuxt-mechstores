<template>
  <header class="g-mb">
    <section class="g-px">
      <div class="nav-bar md:gutter-wrapper">
        <a class="md:gutter" href="#">
          <h1 class="mdd:text-center">Mechstores App</h1>
        </a>
        <div class="nav-bar__buttons">
          <a class="button" href="mailto:info@mindsweep.online">
            <img src="~assets/svg/icon-send.svg"/>
            <span>Give me feedback</span>
          </a>
          <form class="button-wrapper" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_s-xclick"/>
            <input type="hidden" name="hosted_button_id" value="SSVPDTR2E8U22"/>
            <button class="button" type="submit">
              <img src="~assets/svg/icon-unicorn.svg"/>
              <span>Unicorn fund</span>
            </button>
        </form>
        </div>
      </div>
    </section>
  </header>
</template>