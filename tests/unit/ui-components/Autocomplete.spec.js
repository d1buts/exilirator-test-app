import Component from '@/ui-components/Autocomplete.vue';
import sinon from 'sinon';

describe('ui-components/Autocomplete', () => {
    it('#name', () => {
        expect(Component.name).toMatch('Autocomplete');
    });

    it('#props', () => {
        expect(Component.props).toEqual({
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
        });
    });

    it('#data', () => {
        const data = Component.data();

        expect(data.hasOwnProperty('searchQuery')).toBeTruthy();
        expect(data.hasOwnProperty('selectOptions')).toBeTruthy();
        expect(data).toEqual({});
    });

    describe('#computed', () => {
        it('should have correct members', () => {
            expect(Object.keys(Component.computed)).toEqual([
                'isPresentSelect',
                'debounceEmitSearchQuery',
            ]);
        });

        describe('#isPresentSelect', () => {
            [
                {
                    ctx:      {
                        selectOptions: undefined,
                    },
                    expected: false,
                },
                {
                    ctx:      {
                        selectOptions: 'not array',
                    },
                    expected: false,
                },
                {
                    ctx:      {
                        selectOptions: [],
                    },
                    expected: false,
                },
                {
                    ctx:      {
                        selectOptions: [{}],
                    },
                    expected: true,
                },
            ].forEach((tCase, tCaseIndex) => {
                it(`should work correctly in case [${tCaseIndex}]`, () => {
                    expect(Component.computed.isPresentSelect.call(tCase.ctx)).toBe(tCase.expected);
                });
            });
        });

        it('#debounceEmitSearchQuery', () => {
            const ctx = {
                $options:        {
                    debounce: sinon.stub(),
                },
                emitSearchQuery: noop => noop,
                wait:            1000,
            };

            const sampleFunction = () => 'sample function';

            ctx.$options.debounce.throws().withArgs(ctx.emitSearchQuery, ctx.wait).returns(sampleFunction);

            const result = Component.computed.debounceEmitSearchQuery.call(ctx);

            expect(result).toEqual(sampleFunction);

            expect(ctx.$options.debounce.calledOnce).toBeTruthy();
        });
    });

    describe('#watch', () => {
        it('should have correct members', () => {
            expect(Object.keys(Component.watch)).toEqual([
                'options',
                'searchQuery',
            ]);
        });

        it('#options', () => {
            const ctx = {
                setSelectOptions: sinon.stub(),
            };

            Component.watch.options.call(ctx);

            expect(ctx.setSelectOptions.calledOnce).toBeTruthy();
        });

        it('#searchQuery', () => {
            const ctx = {
                debounceEmitSearchQuery: sinon.stub(),
            };

            Component.watch.searchQuery.call(ctx);

            expect(ctx.debounceEmitSearchQuery.calledOnce).toBeTruthy();
        });

        describe('#methods', () => {
            it('should have correct members', () => {
                expect(Object.keys(Component.methods)).toEqual([
                    'onClickOutside',
                    'onClickDropdownOption',
                    'setSelectOptions',
                    'resetSelectOptions',
                    'emitSearchQuery',
                ]);
            });

            it('#onClickOutside', () => {
                const ctx = {
                    resetSelectOptions: sinon.stub(),
                };

                Component.methods.onClickOutside.call(ctx);

                expect(ctx.resetSelectOptions.calledOnce).toBeTruthy();
            });

            it('#onClickDropdownOption', () => {
                const ctx = {
                    resetSelectOptions: sinon.stub(),
                    $emit:              sinon.stub(),
                };

                const sampleOption = {
                    id:   'id',
                    name: 'name',
                };

                ctx.$emit.throws().withArgs('select:option', sampleOption).returns();

                Component.methods.onClickDropdownOption.call(ctx, sampleOption);

                expect(ctx.resetSelectOptions.calledOnce).toBeTruthy();
                expect(ctx.$emit.calledOnce).toBeTruthy();
            });

            it('#setSelectOptions', () => {
                const ctx = {
                    selectOptions: undefined,
                    options:       [{}, {}],
                };

                Component.methods.setSelectOptions.call(ctx);

                expect(ctx.selectOptions).toEqual(ctx.options);
            });

            it('#resetSelectOptions', () => {
                const ctx = {
                    selectOptions: [{}, {}],
                };

                Component.methods.resetSelectOptions.call(ctx);

                expect(ctx.selectOptions).toBeUndefined();
            });

            describe('#emitSearchQuery', () => {
                it('in nominal flow', () => {
                    const ctx = {
                        searchQuery: 'harry potter',
                        minLength:   5,
                        $emit:       sinon.stub(),
                    };

                    ctx.$emit.throws().withArgs('autocomplete:change', ctx.searchQuery).returns();

                    Component.methods.emitSearchQuery.call(ctx);

                    expect(ctx.$emit.calledOnce).toBeTruthy();
                });

                it('in case if search query too short', () => {
                    const ctx = {
                        searchQuery: 'har',
                        minLength:   5,
                        $emit:       sinon.stub(),
                    };

                    ctx.$emit.throws().withArgs('autocomplete:change', ctx.searchQuery).returns();

                    Component.methods.emitSearchQuery.call(ctx);

                    expect(ctx.$emit.notCalled).toBeTruthy();
                });
            });
        });
    });
});
