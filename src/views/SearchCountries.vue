<template lang="pug">
    div
        h2 Search countries
        autocomplete(
            :options="countries"
            @autocomplete:change="onAutocompleteChange"
            @select:option="onSelectOptionAutocomplete"
            placeholder="Search countries"
        )
            template(slot="option" slot-scope="{ option }")
                .custom-option {{ option.name }}
                    img.custom-option__image(:src="option.srcFlag")

        template(v-if="selectedCountry")
            h5 Country information
            p Name: {{ selectedCountry.name }}
            p Capital: {{ selectedCountry.capital }}
            p Population: {{ selectedCountry.population }}
            img.flag(:src="selectedCountry.srcFlag")
</template>

<script>
    import Autocomplete from '../ui-components/Autocomplete';
    import { searchCountries } from '../api/search';

    export default {
        searchCountries,

        name: 'SearchCountries',

        components: {
            Autocomplete,
        },

        data() {
            return {
                countries:       [],
                selectedCountry: undefined,
            };
        },

        methods: {
            /**
             * @param {string} query
             */
            async onAutocompleteChange(query) {
                this.countries = await this.$options.searchCountries(query);
            },

            /**
             * @param {{
             *     id: string,
             *     srcFlag: string,
             *     population: number,
             *     capital: string,
             *     name: string,
             * }} country
             */
            onSelectOptionAutocomplete(country) {
                this.selectedCountry = { ...country };
            },
        },
    };
</script>

<style lang="scss" scoped>
    .custom-option {
        padding: 5px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        &:hover {
            background-color: darken(#fff, 10%);
        }

        &__image {
            width: auto;
            height: auto;
            max-width: 30px;
            max-height: 20px;
        }
    }

    .flag {
        max-width: 380px;
    }
</style>
