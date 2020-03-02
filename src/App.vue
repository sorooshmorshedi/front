<template>
  <div id="app">
    <template v-if="isAppReady">
      <loader/>
      <m-navbar/>
      <div class="container-fluid">
        <router-view></router-view>
      </div>
      <m-footer/>
    </template>
  </div>
</template>

<script>
import mNavbar from "./components/Navbar";
import mFooter from "./components/Footer";
import Loader from "./components/Loader";

import moment from "moment-jalaali";

export default {
  name: "App",
  components: {
    mNavbar,
    mFooter,
    Loader
  },
  data() {
    return {
      isAppReady: false
    };
  },
  created() {
    this.getDateTime();
  },
  methods: {
    getDateTime() {
      this.request({
        url: this.endpoint(`home/time`),
        method: "get",
        token: false,
        success: data => {
          let now = moment(data.time);
          this.$store.commit("setTime", now);
          this.isAppReady = true;
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "./assets/styles/main";

#app {
  .container-fluid {
    min-height: calc(100vh - 103px);
  }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
