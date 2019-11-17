import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    {
        path:      '/search-countries',
        component: () => import('../views/SearchCountries'),
    },
    {
        path:      '/search-books',
        component: () => import('../views/SearchBooks'),
    },
];

const router = new VueRouter({
    routes,
});

export default router;
