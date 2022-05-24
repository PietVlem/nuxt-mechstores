<script setup>
import axios from "axios";

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
const baseApiUrl = 'http://mindsweep-2022.test/api/v2/mechstores.json'

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

function makePostsApiCall(url) {
  console.log(url)
  axios({
    url: url,
    method: 'get'
  }).then(result => {
    if (result.status === 200 && result?.data?.mechstores) {
      mechstores.value = result.data.mechstores
    } else {
      console.error('Error loading posts', result)
    }
  })
}

function toggleFilter(type, value) {
  activeFilters[type].includes(value) ?
    activeFilters[type] = activeFilters.regions.filter(e => e !== value)
    : activeFilters[type].push(value)

  /*create paramstring from active filters for url*/
  const paramsQueryString = createParamsQueryString()

  /*make api call*/
  makePostsApiCall(`${baseApiUrl}?page=${pagination.current_page}&${paramsQueryString}`)
}

function nextPage() {

}

function prevPage() {
  
}

const onMounted = async () => {
  const mechstoreData = await axios.get('http://mindsweep-2022.test/api/v2/mechstores.json')
  mechstores.value = mechstoreData.data.mechstores
  pagination.value = mechstoreData.data.meta.pagination

  const regions = await axios.get('https://www.mindsweep.online/api/v1/regions.json')
  mechstoreRegions.value = regions.data.regions

  const productTypes = await axios.get('https://www.mindsweep.online/api/v1/shopProducts.json');
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
        <div class="pagination">
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