<template>
  <router-view v-if="user"/>
</template>

<script>
import GetUserApi from "@/views/panel/user/getUserApi.js"
export default {
  name: "Panel",
  mixins: [GetUserApi],
  data() {
    return {};
  },
  created() {
    this.getUser();
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
</style>
