<template>
  <router-view v-if="user"/>
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
        url: this.endpoint("users/currentUser/"),
        method: "get",
        success: data => {
          this.$store.commit("setUser", data);

          if(!this.financialYear) this.$router.push({name: 'CompaniesList'})
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>
