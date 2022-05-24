import { defineStore } from "pinia"
import axios from 'axios'

export const useMechstores = defineStore("main", {
    id: 'mechstores-store',
    state: () => ({
        mechstores: [],
        mechstoreRegions: [],
        mechstoreProducts: [],
    }),
    getters: {
        allStores: state => state.mechstores,
        allRegions: state => state.mechstoreRegions,
        allProductTypes: state => state.mechstoreProducts,
    },
    actions: {
        async fetchMechstores () {
            const mechstores = await axios.get('https://www.mindsweep.online/api/v1/mechstores.json');
            this.mechstores = mechstores.data.mechstores;
        },
        async fetchRegions () {
            const regions = await axios.get('https://www.mindsweep.online/api/v1/regions.json');
            this.mechstoreRegions = regions.data.regions;
        },
        async fetchProductTypes () {
            const productTypes = await axios.get('https://www.mindsweep.online/api/v1/shopProducts.json');
            this.mechstoreProducts = productTypes.data.shopProducts;
        }
    }
})