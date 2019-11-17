<template lang="pug">
  #app
    h1 Test task
    template(v-for="page in pages")
      router-link(:to="page.to") {{ page.name }}
      br
    hr
    router-view
</template>

<script>

  export default {
    name: 'app',

    data() {
      return {
        pages: [
          { to: 'search-countries', name: 'Search countries' },
          { to: 'search-books', name: 'Search books' },
        ],
      };
    },
  };
</script>
