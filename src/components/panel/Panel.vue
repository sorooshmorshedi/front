<template>
  <router-view />
</template>

<script>
export default {
  name: 'Panel',
  data() {
    return {}
  },
  created(){
    // if has no companey
    // this.$router.push({name:'CreateCompany'});
  }
}
</script>

<style scoped lang="scss">
* {}
</style>
