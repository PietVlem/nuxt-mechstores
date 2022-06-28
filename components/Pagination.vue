<script setup>
const {
    /*State*/
    pagination,

    /*Methods*/
    nextPage,
    prevPage,
} = useMechstoresApi()
</script>

<template>
    <div class="pagination">
        <a class="pagination__button pagination__button--prev-page" href="#" @click.prevent="prevPage">
            <img src="~assets/svg/icon-arrow-left.svg" alt="previous page" />
        </a>
        <span class="pagination__pages">{{ pagination.current_page }}/{{ pagination.total_pages }}</span>
        <a class="pagination__button pagination__button--next-page" href="#" @click.prevent="nextPage">
            <img src="~assets/svg/icon-arrow-right.svg" alt="next page" />
        </a>
    </div>
</template>