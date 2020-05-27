<template>
  <div class="row">
    <div class="col-12">
    </div>
  </div>
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
    closeAccounts() {
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
