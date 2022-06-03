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
  products: []
})
const pagination = ref({
  total_pages: 1,
  current_page: 1
})
const mechstores = ref([])
const mechstoreRegions = ref([])
const mechstoreProducts = ref([])
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
  /*push the filter into the active filters array or remove them if the filter is active*/
  if(activeFilters[type].includes(value)){
    activeFilters[type] = activeFilters[type].filter(e => e !== value)
  } else {
    activeFilters[type].push(value)
    splitbee.track(`Filtered on ${value}`, { plan: `${type} filter` })
  }

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
    history.replaceState({}, '', `${location.pathname}${queryString}`)

    /*Make api call*/
    makeStoresApiCall(`${baseApiUrl}${queryString}`)
  }, 750)
}

function SplitbeeEvent(storeTitle) {
  splitbee.track(`${storeTitle} link clicked`, { plan: "Store link followed" })
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
        <div class="filters-wrapper">
          <form class="store-filters">
            <div class="store-filters__region">
              <h3>Region</h3>
              <fieldset>
                <div class="form-group" v-for="(region, index) in mechstoreRegions" :key="index">
                  <button @click.prevent="toggleFilter('regions', region.id)"
                    :class="[`region-${region.slug}`, { 'active': activeFilters.regions.includes(region.id) }]">{{
                        region.title
                    }}</button>
                </div>
              </fieldset>
            </div>
            <div class="store-filters__product-types">
              <h3>Product type</h3>
              <fieldset>
                <div class="form-group" v-for="(productType, index) in mechstoreProducts" :key="index">
                  <button @click.prevent="toggleFilter('products', productType.id)"
                    :class="[`product-type-${productType.slug}`, { 'active': activeFilters.products.includes(productType.id) }]">{{
                        productType.title
                    }}</button>
                </div>
              </fieldset>
            </div>
          </form>
          <form class="search-from">
            <div data-filter-group>
              <input @input="searchStores()" v-model="search" type="search"
                placeholder="search..." id="search-input">
            </div>
          </form>
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
          <button @click="prevPage">prev</button>
          <span class="pagination__pages">{{ pagination.current_page }}/{{ pagination.total_pages }}</span>
          <button @click="nextPage">next</button>
        </div>
      </div>
    </section>
  </div>
</template>