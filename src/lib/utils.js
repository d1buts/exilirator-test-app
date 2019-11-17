export const debounce = (func, ms) => {
    let timeout;

    return (...args) => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            func(...args);
            clearTimeout(timeout);
        }, ms);
    };
};
