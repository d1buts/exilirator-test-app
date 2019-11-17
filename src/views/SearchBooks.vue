<template lang="pug">
    div
        h2 Search books
        p Limit of search results &nbsp;
            input(type="number" v-model="limitResults")
        autocomplete(
            :options="books"
            @autocomplete:change="onAutocompleteChange"
            @select:option="onSelectOptionAutocomplete"
            placeholder="Search books"
        )

        template(v-if="selectedBook")
            span {{ selectedBook }}
</template>

<script>
    import Autocomplete from '../ui-components/Autocomplete';
    import { searchBooks } from '../api/search';

    export default {
        searchBooks,

        name: 'SearchBooks',

        components: {
            Autocomplete,
        },

        data() {
            return {
                books:        [],
                limitResults: 10,
                selectedBook: undefined,
            };
        },

        methods: {
            /**
             * @param {string} query
             */
            async onAutocompleteChange(query) {
                this.books = await this.$options.searchBooks(query, this.limitResults);
            },

            /**
             * @param {{
             *     id: string,
             *     name: string,
             * }} book
             */
            onSelectOptionAutocomplete(book) {
                this.selectedBook = { ...book };
            },
        },
    };
</script>
