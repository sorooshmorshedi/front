<template>
  <router-view v-if="user && systemOptions"/>
</template>

<script>
import GetUserApi from "@/views/panel/user/getUserApi.js"
import GetOptionsApi from "@/views/panel/options/getOptionsApi.js"
export default {
  name: "Panel",
  mixins: [GetUserApi, GetOptionsApi],
  data() {
    return {};
  },
  created() {
    this.getUser();
    this.getOptions();
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
</style>
