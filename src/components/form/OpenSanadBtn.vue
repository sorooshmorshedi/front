<template>
  <v-btn @click="openSanad(sanad.id)" :class="btnClasses" v-bind="$attrs" :outlined="tableStyle">
    مشاهده سند
    <v-chip class="app-background-color mr-2" x-small>{{ sanad.code }}</v-chip>
  </v-btn>
</template>

<script>
export default {
  props: {
    sanad: {
      type: Object,
      required: true
    },
    tableStyle: {
      default: false
    }
  },
  computed: {
    btnClasses() {
      if (this.tableStyle) {
      } else {
        return "blue white--text mr-1";
      }
    }
  },
  mounted() {
    setTimeout(() => {
      console.log(this.$attrs);
    }, 1000);
  },
  methods: {
    openSanad() {
      let routeData = this.$router.resolve({
        name: "SanadForm",
        params: {
          id: this.sanad.id
        }
      });
      window.open(routeData.href, "_blank");
    }
  }
};
</script>

<style>
</style>