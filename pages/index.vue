<script setup>
import splitbee from '@splitbee/web'
import axios from "axios"
const config = useRuntimeConfig()

definePageMeta({
  title: 'Stores'
})

/*Declaire vars*/
const search = ref('')
const activeFilters = reactive({
  regions: [],
  products: [],
  countries: []
})
const pagination = ref({
  total_pages: 1,
  current_page: 1
})
const activeDropDown = ref('null')
const mechstores = ref([])
const mechstoreRegions = ref([])
const mechstoreProducts = ref([])
const mechstoreCountries = ref([])
const baseApiUrl = `${config.MINDSWEEP_API_BASEURL}/api/v2/mechstores.json`
let timer = undefined

/*Methods*/
function createQueryString(params) {
  /*Join params key-values into queryString*/
  let queryString = ""
  if (Object.keys(params).length !== 0) {
    for (const [key, value] of Object.entries(params)) {
      queryString = `${queryString}&${key}=${value}`
    }
    /* Replace leading '&' by '?' -> replace by default only replaces first occurrence*/
    queryString = queryString.replace("&", "?")
  }

  return queryString
}

function createParamsQueryString() {
  /*create paramstring from active filters for url*/
  /*example: mindsweep-2022.test/api/v2/mechstores.json?filters[region][]=1481*/
  const params = new URLSearchParams()

  activeFilters.regions.forEach(filter => {
    params.append(`filters[region][]`, filter)
  })

  activeFilters.products.forEach(filter => {
    params.append(`filters[shopProducts][]`, filter)
  })

  return decodeURIComponent(params.toString())
}

function makeStoresApiCall(url) {
  axios({
    url: url,
    method: 'get'
  }).then(result => {
    if (result.status === 200 && result?.data?.mechstores) {
      mechstores.value = result.data.mechstores
      pagination.value = result.data.meta.pagination
    } else {
      console.error('Error loading posts', result)
    }
  })
}

function toggleFilter(type, value) {
  /*Clear search input*/
  search.value = ''

  /*push the filter into the active filters array or remove them if the filter is active*/
  activeFilters[type].includes(value) ?
    activeFilters[type] = activeFilters[type].filter(e => e !== value)
    : activeFilters[type].push(value)

  /*close dropdown*/
  activeDropDown.value = null

  /*reset current page*/
  pagination.value.current_page = 1

  /*create querystring*/
  const queryString = createQueryString({
    page: pagination.value.current_page
  })

  /*create paramstring from active filters*/
  const paramsQueryString = createParamsQueryString()

  /*Update url*/
  const newUrl = `${location.pathname}?${paramsQueryString}`
  history.replaceState({}, '', newUrl)

  /*make api call*/
  makeStoresApiCall(`${baseApiUrl}${queryString}&${paramsQueryString}`)
}

function nextPage() {
  if (pagination.value.current_page !== pagination.value.total_pages) {
    /*change page param to next page*/
    pagination.value.current_page += 1

    /*create querystring*/
    const queryString = createQueryString({
      page: pagination.value.current_page
    })

    /*create paramstring from active filters for url*/
    const paramsQueryString = createParamsQueryString()

    /*Update url*/
    history.replaceState({}, '', `${location.pathname}${queryString}&${paramsQueryString}`)

    /*make api call*/
    makeStoresApiCall(`${baseApiUrl}${queryString}&${paramsQueryString}`)

    /*go back to the top of the page*/
    window.scrollTo(0, 0)
  }
}

function prevPage() {
  if (pagination.value.current_page > 1) {
    /*change page param to next page*/
    pagination.value.current_page -= 1

    /*create querystring*/
    const queryString = createQueryString({
      page: pagination.value.current_page
    })

    /*create paramstring from active filters for url*/
    const paramsQueryString = createParamsQueryString()

    /*Update url*/
    history.replaceState({}, '', `${location.pathname}${queryString}&${paramsQueryString}`)

    /*make api call*/
    makeStoresApiCall(`${baseApiUrl}${queryString}&${paramsQueryString}`)

    /*go back to the top of the page*/
    window.scrollTo(0, 0)
  }
}

function searchStores() {
  clearTimeout(timer)

  timer = setTimeout(() => {
    /*Reset filters*/
    activeFilters.regions = []
    activeFilters.products = []

    /*create querystring from active filters*/
    const queryString = createQueryString({
      search: search.value
    })

    /*Update url*/
    const updatedUrl = search.value ? location.pathname + queryString : location.pathname
    history.replaceState({}, '', updatedUrl)

    /*Make api call*/
    makeStoresApiCall(`${baseApiUrl}${queryString}`)
  }, 750)
}

function SplitbeeEvent(storeTitle) {
  splitbee.track(`${storeTitle} link clicked`, { plan: "Store link followed" })
}

function toggleDropdown(dropdown) {
  if (activeDropDown.value) {
    activeDropDown.value !== dropdown ? activeDropDown.value = dropdown : activeDropDown.value = null
  } else {
    activeDropDown.value = dropdown
  }
}

async function getPosts() {
  const queryParams = window.location.search
  if (queryParams !== '') {
    /*Set Url params from queryParams*/
    let urlParams = new URLSearchParams(queryParams)

    /*Get filter parameters*/
    for (const [type, value] of urlParams) {
      console.log(type, value)
      switch (type) {
        case 'search':
          search.value = value
          break
        case 'page':
          pagination.current_page = value
          break
        default:
          const filterType = type.substring(8, type.length - 3)
          switch (filterType) {
            case 'region':
              activeFilters.regions.push(+value)
              break
            case 'shopProducts':
              activeFilters.products.push(+value)
              break
            default:
              console.log(`${filterType} not found`)
          }
          break
      }
    }

    /*create querystring from active filters*/
    const queryString = createQueryString({
      search: search.value,
      page: pagination.value.current_page
    })

    /*create paramstring from active filters*/
    const paramsQueryString = createParamsQueryString()

    /*make api call*/
    await makeStoresApiCall(`${baseApiUrl}${queryString}&${paramsQueryString}`)
  } else {
    makeStoresApiCall(baseApiUrl)
  }
}

async function getFilters() {
  /*get regions*/
  const regions = await axios.get(`${config.MINDSWEEP_API_BASEURL}/api/v1/regions.json`)
  mechstoreRegions.value = regions.data.regions

  /*get product types*/
  const productTypes = await axios.get(`${config.MINDSWEEP_API_BASEURL}/api/v1/shopProducts.json`)
  mechstoreProducts.value = productTypes.data.shopProducts

  /*get countries*/
  const countries = await axios.get(`${config.MINDSWEEP_API_BASEURL}/api/v2/countries.json`)
  const countriesObj = countries.data.countries
  for (const key in countriesObj) {
    mechstoreCountries.value.push(countriesObj[key])
  }
}

onMounted(async () => {
  /*init splitbee*/
  splitbee.init()

  /*get data*/
  getFilters()
  getPosts()
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
            <div class="dropdown">
              <button @click.prevent="toggleDropdown('countries')" class="dropdown__button">
                Country
                <img src="~assets/svg/icon-chevron-down.svg" />
              </button>
              <div v-show="activeDropDown === 'countries'" class="dropdown__content">
                <button class="option" v-for="(country, index) in mechstoreCountries" :key="index"
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
        <div class="stores">
          <a v-for="store in mechstores" :key="store.id" :id="`store-${store.id}`" class="stores__single"
            :class="store.region.slug" :href="store.url" target="_blank" @click="SplitbeeEvent(store.title)">
            <article class="store-snippet">
              <span v-if="store.country" class="store-snippet__country">{{ store.country }}</span>
              <div class="store-snippet__image-wrapper">
                <img v-if="store.logo" :alt="`image for ${store.title}`" :src="store.logo">
              </div>
              <h2 class="store-snippet__title">{{ store.title }}</h2>
              <div class="store-snippet__products">
                <span v-for="(product, index) in store.shopProducts" :key="index">
                  {{ product.title }}
                </span>
              </div>
            </article>
          </a>
        </div>
        <div v-if="pagination.total_pages > 1" class="pagination">
          <a class="pagination__button pagination__button--prev-page" href="#" @click.prevent="prevPage">
            <img src="~assets/svg/icon-arrow-left.svg" alt="previous page" />
          </a>
          <span class="pagination__pages">{{ pagination.current_page }}/{{ pagination.total_pages }}</span>
          <a class="pagination__button pagination__button--next-page" href="#" @click.prevent="nextPage">
            <img src="~assets/svg/icon-arrow-right.svg" alt="next page" />
          </a>
        </div>
      </div>
    </section>
  </div>
</template>