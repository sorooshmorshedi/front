<template>
</template>

<script>
export default {
  name: 'Panel',
  data() {
    return {}
  },
  created(){
    // if has no companey
    this.$router.push('CreateCompany');
  }
}
</script>

<style scoped lang="scss">
* {}
</style>
