import axios from "axios"

export default function useMechstoresApi() {
    const config = useRuntimeConfig()
    const baseApiUrl = `${config.MINDSWEEP_API_BASEURL}/api/v2/mechstores.json`
    const filterObject = {
        regions: [],
        products: [],
        countries: []
    }
    const paginationObject = {
        total_pages: 1,
        current_page: 1
    }
    let timer = undefined

    /*
    --------------
    State
    --------------
    */
    const mechstores = useState('mechstores', () => [])
    const mechstoreRegions = useState('mechstoreRegions', () => [])
    const mechstoreProducts = useState('mechstoreProducts', () => [])
    const mechstoreCountries = useState('mechstoreCountries', () => [])
    const countrySearch = useState('countrySearch', () => '')
    const activeFilters = useState('activeFilters', () => filterObject)
    const pagination = useState('pagination', () => paginationObject)
    const search = useState('search', () => '')

    /*
    --------------
    getters
    --------------
    */
    const mechstoreCountriesFiltered = computed(() => {
        return mechstoreCountries.value.filter(country => country.toLowerCase().includes(countrySearch.value.toLowerCase()))
    })

    /*
    --------------
    Methods
    --------------
    */

    /*Helper*/
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

        activeFilters.value.regions.forEach(filter => {
            params.append(`filters[region][]`, filter)
        })

        activeFilters.value.products.forEach(filter => {
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

    /*Actions*/
    async function getFilters() {
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

    async function getMechStores() {
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
                    case 'country':
                        if (value !== '') activeFilters.value.countries.push(value)
                        break
                    default:
                        const filterType = type.substring(8, type.length - 3)
                        switch (filterType) {
                            case 'region':
                                activeFilters.value.regions.push(+value)
                                break
                            case 'shopProducts':
                                activeFilters.value.products.push(+value)
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
                page: pagination.value.current_page,
                country: activeFilters.value.countries[0] ?? ''
            })

            /*create paramstring from active filters*/
            const paramsQueryString = createParamsQueryString()

            /*make api call*/
            await makeStoresApiCall(`${baseApiUrl}${queryString}&${paramsQueryString}`)
        } else {
            makeStoresApiCall(baseApiUrl)
        }
    }

    function storeFilter(type, value) {
        /*Clear search input*/
        search.value = ''
        countrySearch.value = ''

        /*Clear countries if filtering for reagions and the other way around*/
        if (type === 'countries') activeFilters.value.regions = []
        if (type === 'regions') activeFilters.value.countries = []

        /*push the filter into the active filters array or remove them if the filter is active*/
        activeFilters.value[type].includes(value) ?
            activeFilters.value[type] = activeFilters.value[type].filter(e => e !== value)
            : activeFilters.value[type].push(value)

        /*Only allow 1 country to be filtered on*/
        if (activeFilters.value.countries.length > 1) activeFilters.value.countries.shift()

        /*reset current page*/
        pagination.value.current_page = 1

        /*create querystring*/
        const queryString = createQueryString({
            page: pagination.value.current_page,
            country: activeFilters.value.countries[0] ?? ''
        })

        /*create paramstring from active filters*/
        const paramsQueryString = createParamsQueryString()

        /*Update url*/
        const newUrl = `${location.pathname}${queryString}&${paramsQueryString}`
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
                page: pagination.value.current_page,
                country: activeFilters.value.countries[0] ?? ''
            })

            /*create paramstring from active filters for url*/
            const paramsQueryString = createParamsQueryString()

            /*Update url*/
            history.replaceState({}, '', `${location.pathname}${queryString}&${paramsQueryString}`)

            /*make api call*/
            makeStoresApiCall(`${baseApiUrl}${queryString}&${paramsQueryString}`)
        }
    }

    function prevPage() {
        if (pagination.value.current_page > 1) {
            /*change page param to next page*/
            pagination.value.current_page -= 1

            /*create querystring*/
            const queryString = createQueryString({
                page: pagination.value.current_page,
                country: activeFilters.value.countries[0] ?? ''
            })

            /*create paramstring from active filters for url*/
            const paramsQueryString = createParamsQueryString()

            /*Update url*/
            history.replaceState({}, '', `${location.pathname}${queryString}&${paramsQueryString}`)

            /*make api call*/
            makeStoresApiCall(`${baseApiUrl}${queryString}&${paramsQueryString}`)
        }
    }

    function searchStores() {
        clearTimeout(timer)

        timer = setTimeout(() => {
            /*Reset filters*/
            activeFilters.value.regions = []
            activeFilters.value.products = []
            activeFilters.value.countries = []

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

    function toggleDropdown(dropdown) {
        if (activeDropDown.value) {
            activeDropDown.value !== dropdown ? activeDropDown.value = dropdown : activeDropDown.value = null
        } else {
            activeDropDown.value = dropdown
        }
    }

    return {
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
        nextPage,
        prevPage,
        searchStores
    }
}