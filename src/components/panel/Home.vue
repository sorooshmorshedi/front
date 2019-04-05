<template>
<div class="row">
    <div class="col-12">
      <button @click="closeAccounts" type="button" class="btn btn-primary">بستن حساب ها</button>
      </div> 
</div>
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
    },
    closeAccounts(){
      this.request({
        url: this.endpoint("companies/closeAccounts"),
        method: "post",
        success: data => {
          this.successNotify();
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>
