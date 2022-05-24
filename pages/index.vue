<script setup>
import axios from "axios"
const config = useRuntimeConfig()

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

watch(search, () => {
  clearTimeout(timer)

  timer = setTimeout(() => {
    activeFilters.regions = []
    activeFilters.products = []
    search.value !== '' ? 
      makeStoresApiCall(`${baseApiUrl}?search='${search.value}'`)
      : makeStoresApiCall(`${baseApiUrl}`)
  }, 750)
})

/*Methods*/
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
  console.log(url)
  axios({
    url: url,
    method: 'get'
  }).then(result => {
    if (result.status === 200 && result?.data?.mechstores) {
      mechstores.value = result.data.mechstores
      pagination.value = result.data.meta.pagination;
    } else {
      console.error('Error loading posts', result)
    }
  })
}

function toggleFilter(type, value) {
  /*push filters into active filters array*/
  activeFilters[type].includes(value) ?
    activeFilters[type] = activeFilters.regions.filter(e => e !== value)
    : activeFilters[type].push(value)

  /*create paramstring from active filters for url*/
  const paramsQueryString = createParamsQueryString()

  /*reset page*/
  pagination.value.current_page = 1

  /*make api call*/
  makeStoresApiCall(`${baseApiUrl}?page=${pagination.value.current_page}&${paramsQueryString}`)
}

function nextPage() {
  if (pagination.value.current_page !== pagination.value.total_pages) {
    /*change page param to next page*/
    const nextpage = pagination.value.current_page + 1

    /*create paramstring from active filters for url*/
    const paramsQueryString = createParamsQueryString()

    /*make api call*/
    makeStoresApiCall(`${baseApiUrl}?page=${nextpage}&${paramsQueryString}`)

    /*go back to the top of the page*/
    window.scrollTo(0, 0);
  }
}

function prevPage() {
  if (pagination.value.current_page > 1) {
    /*change page param to next page*/
    const nextpage = pagination.value.current_page - 1

    /*create paramstring from active filters for url*/
    const paramsQueryString = createParamsQueryString()

    /*make api call*/
    makeStoresApiCall(`${baseApiUrl}?page=${nextpage}&${paramsQueryString}`)

    /*go back to the top of the page*/
    window.scrollTo(0, 0);
  }
}

const onMounted = async () => {
  /*get stores*/
  makeStoresApiCall(`${config.MINDSWEEP_API_BASEURL}/api/v2/mechstores.json`)

  /*get regions*/
  const regions = await axios.get(`${config.MINDSWEEP_API_BASEURL}/api/v1/regions.json`)
  mechstoreRegions.value = regions.data.regions

  /*get product types*/
  const productTypes = await axios.get(`${config.MINDSWEEP_API_BASEURL}/api/v1/shopProducts.json`);
  mechstoreProducts.value = productTypes.data.shopProducts;
}

onMounted();
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
              <fieldset data-filter-group="product">
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
              <label class="hidden" for="search-input"></label>
              <input data-search-attribute="data-name" v-model="search" type="search" placeholder="search..."
                id="search-input">
            </div>
          </form>
        </div>
        <div class="stores">
          <a v-for="store in mechstores" :key="store.id" :id="`store-${store.id}`" class="stores__single"
            :class="store.region.slug" :href="store.url" target="_blank">
            <article class="store-snippet">
              <span v-if="store.country" class="store-snippet__country">{{ store.country }}</span>
              <div class="store-snippet__image-wrapper">
                <img :alt="`image for ${store.title}`" :src="store.logo">
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

<style>
.hide-block {
  @apply hidden;
}
</style>