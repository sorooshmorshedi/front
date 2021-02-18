<template>
  <v-icon @click="openLedger" color="cyan" :disabled="query == null">fa-book-open</v-icon>
</template>

<script>
export default {
  props: {
    query: {
      default: null,
    },
  },
  methods: {
    openLedger() {
      let routeData = this.$router.resolve({
        name: "LedgerReport",
        query: this.query,
      });
      window.open(routeData.href, "_blank");
    },
  },
};
</script>

<style>
</style>