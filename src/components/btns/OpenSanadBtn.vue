<template>
  <v-btn
    @click="openSanad(sanad.id)"
    :class="btnClasses"
    v-bind="$attrs"
    :outlined="tableStyle"
    class="mt-1 mt-md-0 elevation-0 cursor-pointer"
    title="مشاهده سند"
    rounded
  >
    <v-icon class="cursor-pointer">$sanadIcon</v-icon>
    <v-chip class="app-background-color mr-2 cursor-pointer" x-small>{{
      sanad.code
    }}</v-chip>
  </v-btn>
</template>

<script>
export default {
  props: {
    sanad: {
      type: Object,
      required: true,
    },
    tableStyle: {
      default: false,
    },
  },
  computed: {
    btnClasses() {
      if (this.tableStyle) {
      } else {
        return "blue white--text mr-1";
      }
    },
  },
  mounted() {},
  methods: {
    openSanad() {
      let routeData = this.$router.resolve({
        name: "SanadForm",
        params: {
          id: this.sanad.id,
        },
      });
      // window.open(routeData.href, "_blank");
      window.open(routeData.href);
    },
  },
};
</script>

<style>
.cursor-pointer {
  cursor: pointer;
}
</style>
