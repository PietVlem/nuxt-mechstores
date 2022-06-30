<script setup>
/*Meta data*/
definePageMeta({
  title: 'Stores'
})

/*Composables*/
const { splitbeeInit, SplitbeeEvent } = useSplitbee()
const {
  /*State*/
  mechstores,
  mechstoreRegions,
  mechstoreProducts,
  countrySearch,
  activeFilters,
  pagination,
  search,

  /*getters*/
  mechstoreCountriesFiltered,

  /*Methods*/
  getFilters,
  getMechStores,
  storeFilter,
  searchStores
} = useMechstoresApi()

/*Declaire vars*/
const activeDropDown = ref('null')

/*Methods*/
function toggleFilter(type, value) {
  /*close dropdown*/
  activeDropDown.value = null

  /*api call*/
  storeFilter(type, value)
}

function toggleDropdown(dropdown) {
  if (activeDropDown.value) {
    activeDropDown.value !== dropdown ? activeDropDown.value = dropdown : activeDropDown.value = null
  } else {
    activeDropDown.value = dropdown
  }
}

function focusCard(e) {
  const allCards = document.querySelectorAll('.card')
  allCards.forEach(card => card.style.opacity = "50%")
  e.target.style.opacity = "100%"
}

function removeFocus() {
  const allCards = document.querySelectorAll('.card')
  allCards.forEach(card => card.style.opacity = "100%")
}

onMounted(async () => {
  /*init splitbee*/
  splitbeeInit()

  /*get data*/
  await getFilters()
  await getMechStores()
})
</script>

<template>
  <div class="store-list g-mb">
    <section class="g-px">
      <div class="row-xl">
        <div class="stores-filters">
          <div class="stores-filters__dropdowns">
            <div class="dropdown">
              <button @click.prevent="toggleDropdown('regions')" class="dropdown__button">
                Region
                <img src="~assets/svg/icon-chevron-down.svg" />
              </button>
              <div v-show="activeDropDown === 'regions'" class="dropdown__content">
                <button class="option" v-for="(region, index) in mechstoreRegions" :key="index"
                  @click.prevent="toggleFilter('regions', region.id)" :class="`option--${region.slug}`">
                  {{ region.title }}
                </button>
              </div>
            </div>
            <div class="dropdown">
              <button @click.prevent="toggleDropdown('products')" class="dropdown__button">
                Product type
                <img src="~assets/svg/icon-chevron-down.svg" />
              </button>
              <div v-show="activeDropDown === 'products'" class="dropdown__content">
                <button class="option" v-for="(product, index) in mechstoreProducts" :key="index"
                  @click.prevent="toggleFilter('products', product.id)">{{
                      product.title
                  }}</button>
              </div>
            </div>
            <div class="dropdown dropdown--countries">
              <button @click.prevent="toggleDropdown('countries')" class="dropdown__button">
                Country
                <img src="~assets/svg/icon-chevron-down.svg" />
              </button>
              <div v-show="activeDropDown === 'countries'" class="dropdown__content">
                <form>
                  <input placeholder="search..." type="search" v-model="countrySearch" />
                </form>
                <button class="option" v-for="(country, index) in mechstoreCountriesFiltered" :key="index"
                  @click.prevent="toggleFilter('countries', country)">{{
                      country
                  }}</button>
              </div>
            </div>
          </div>
          <form class="search-from">
            <div>
              <input @input="searchStores()" v-model="search" type="search" placeholder="search..." id="search-input">
            </div>
          </form>
        </div>
        <div v-if="activeFilters.regions.length || activeFilters.products.length || activeFilters.countries.length"
          class="active-filters">
          <button class="tag" v-for="activeRegionId in activeFilters.regions" :key="activeRegionId"
            @click="toggleFilter('regions', activeRegionId)"
            :class="`tag--${mechstoreRegions.find(region => region.id === activeRegionId).slug}`">
            {{ mechstoreRegions.find(region => region.id === activeRegionId).title }}
            <img src="~assets/svg/icon-x.svg" />
          </button>
          <button class="tag" v-for="activeProductId in activeFilters.products" :key="activeProductId"
            @click="toggleFilter('products', activeProductId)">
            {{ mechstoreProducts.find(product => product.id === activeProductId).title }}
            <img src="~assets/svg/icon-x.svg" />
          </button>
          <button class="tag" v-for="(country, index) in activeFilters.countries" :key="index"
            @click="toggleFilter('countries', country)">
            {{ country }}
            <img src="~assets/svg/icon-x.svg" />
          </button>
        </div>
        <div v-if="mechstores.length" class="stores">
          <Card v-for="store in mechstores" :key="store.id" @click="SplitbeeEvent(store.title)" :store="store"
            @mouseenter="focusCard" @mouseleave="removeFocus" />
        </div>
        <div v-else>No stores with these filters were found</div>
        <Pagination v-if="pagination.total_pages > 1" />
      </div>
    </section>
  </div>
</template>