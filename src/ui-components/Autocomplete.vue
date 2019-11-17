<template lang="pug">
    .autocomplete__wrapper(v-click-outside="onClickOutside")
        input.autocomplete__input(
            :placeholder="placeholder"
            type="text"
            v-model="searchQuery"
        )

        template(v-if="isPresentSelect")
            .autocomplete__dropdown
                template(v-for="option in selectOptions")
                    .autocomplete__option(
                        :key="option.id"
                        @click="onClickDropdownOption(option)"
                    )
                        slot(
                            name="option"
                            :option="option"
                        )
                            .autocomplete__option-content {{ option.name }}
</template>

<script>
    import vClickOutside from 'v-click-outside';
    import { debounce } from '../lib/utils';

    export default {
        debounce,

        name: 'Autocomplete',

        directives: {
            clickOutside: vClickOutside.directive,
        },

        props: {
            minLength:   {
                type:    Number,
                default: 3,
            },
            wait:        {
                type:    Number,
                default: 1000,
            },
            options:     {
                type:     Array,
                required: false,
            },
            placeholder: {
                type:     String,
                required: false,
            },
        },

        data() {
            return {
                searchQuery:   undefined,
                selectOptions: undefined,
            };
        },

        computed: {
            /**
             * @returns {Boolean}
             */
            isPresentSelect() {
                return Array.isArray(this.selectOptions) && Boolean(this.selectOptions.length);
            },

            /**
             * @returns {function}
             */
            debounceEmitSearchQuery() {
                return this.$options.debounce(this.emitSearchQuery, this.wait);
            },
        },

        watch: {
            options() {
                this.setSelectOptions();
            },
            searchQuery() {
                this.debounceEmitSearchQuery();
            },
        },

        methods: {
            onClickOutside() {
                this.resetSelectOptions();
            },

            /**
             * @param {object} option
             */
            onClickDropdownOption(option) {
                this.resetSelectOptions();

                this.$emit('select:option', option);
            },

            setSelectOptions() {
                this.selectOptions = this.options;
            },

            resetSelectOptions() {
                this.selectOptions = undefined;
            },

            emitSearchQuery() {
                if (this.searchQuery.length < this.minLength) {
                    return;
                }

                this.$emit('autocomplete:change', this.searchQuery);
            },
        },
    };
</script>

<style lang="scss" scoped>
    .autocomplete {
        &__wrapper {
            position: relative;
            width: 320px;
        }

        &__input,
        &__dropdown {
            width: 100%;
            font-size: 20px;
            line-height: 1.5;
            border: 1px solid black;
        }

        &__input {
            margin-bottom: 2px;
        }

        &__dropdown {
            position: absolute;
            top: 100%;
            max-height: 320px;
            overflow-y: auto;
            background-color: #fff;
        }

        &__option {
            cursor: pointer;
            border-bottom: 1px solid black;

            &:last-child {
                border-bottom: none;
            }

            &-content {
                padding: 2px 5px;
            }
        }
    }
</style>
