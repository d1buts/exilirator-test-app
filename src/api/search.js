const URL_SEARCH_COUNTRIES = query => `https://restcountries.eu/rest/v2/name/${query}`;
const URL_SEARCH_BOOKS     = (query, limit) => `https://openlibrary.org/search.json?q=${query}&limit=${limit}`;

/**
 * @param {string} query
 * @returns {{
 *     id: string,
 *     srcFlag: string,
 *     population: number,
 *     capital: string,
 *     name: string,
 * }[]|undefined}
 */
export const searchCountries = async query => {
    const url = URL_SEARCH_COUNTRIES(query);

    const response = await fetch(url);

    if (!response.ok) {
        return;
    }

    const json = await response.json();

    return json.map(country => ({
        id:         country.numericCode,
        srcFlag:    country.flag,
        population: country.population,
        capital:    country.capital,
        name:       country.name,
    }));
};

/**
 * @param {string} query
 * @param {number} [limit]
 * @returns {{
 *     id: string,
 *     name: string,
 * }[]|undefined}
 */
export const searchBooks = async (query, limit = 10) => {
    const url = URL_SEARCH_BOOKS(query, limit);

    const response = await fetch(url);

    if (!response.ok) {
        return;
    }

    const json = await response.json();

    return json.docs.map(book => {
        let authors;

        if (Array.isArray(book.author_name)) {
            authors = book.author_name.join(', ');
        } else {
            authors = 'unknown authors';
        }

        return {
            id:   `${book.cover_i}-${book.last_modified_i}`,
            name: `"${book.title_suggest}" by ${authors}`,
        };
    });
};
