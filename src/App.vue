<template>
  <div id="app">
    <m-navbar />
    <div class="container-fluid">
      <router-view></router-view>
    </div>
    <m-footer />
  </div>
</template>

<script>
import mNavbar from "./components/Navbar";
import mFooter from "./components/Footer";
export default {
  name: "App",
  components: {
    mNavbar,
    mFooter
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
