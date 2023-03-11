<template>
  <v-tooltip top color="secondary">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          v-bind="attrs"
          v-on="on"
          icon
          @click="openLedger" :disabled="query == null"
          class="back white--text mr-1  pa-4" depressed>
        <v-img max-width="25" src="/img/icons/open_ledger.svg"></v-img>
      </v-btn>

    </template>
    دفتر کل
  </v-tooltip>

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