<template>
  <v-icon title="کاردکس" @click="openInventory" color="cyan" :disabled="!wareId">fa-pallet</v-icon>
</template>

<script>
export default {
  props: {
    wareId: {
      default: null,
    },
  },
  methods: {
    openInventory() {
      let routeData = this.$router.resolve({
        name: "DetailedWareInventoryReport",
        query: {
          "inventory.ware": this.wareId,
        },
      });
      window.open(routeData.href, "_blank");
    },
  },
};
</script>

<style>
</style>