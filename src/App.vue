<template>
<div id="app">
  <m-nav/>
  <div class="container-fluid">
    <router-view/>
  </div>
</div>
</template>

<script>
import mNav from './components/Nav';
export default {
  name: 'App',
  components: {
    mNav
  }
}
</script>

<style lang="scss">
@import './assets/styles/main';
</style>
