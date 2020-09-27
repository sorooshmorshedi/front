<template>
  <div class></div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {};
  },
  computed: {
    companyName() {
      if (this.company) return this.company.name;
      return "-";
    }
  }
};
</script>

<style scoped lang="scss">
</style>
