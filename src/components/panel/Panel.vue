<template>
  <router-view />
</template>

<script>
export default {
  name: "Panel",
  data() {
    return {};
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.request({
        url: this.endpoint("users/getUser/"),
        method: "get",
        success: data => {
          this.$store.commit("setUser", data);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>
