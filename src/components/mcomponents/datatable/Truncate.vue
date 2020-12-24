<template>
  <span :title="needTruncate?value:''">{{ truncatedValue }}</span>
</template>

<script>
export default {
  props: {
    value: {},
    maxLength: {
      default: 30,
    },
  },
  computed: {
    needTruncate() {
      if (
        typeof this.value == typeof "" &&
        this.value.length > this.maxLength + 20
      ) {
        return true;
      }
    },
    truncatedValue() {
      if (this.needTruncate) return this.value.substr(0, 30) + "...";
      return this.value;
    },
  },
};
</script>

<style>
</style>