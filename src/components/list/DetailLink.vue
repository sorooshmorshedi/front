<template>
  <v-btn color="light-blue white--text" :to="to" icon :target="newTab?'_blank':''">
    <v-icon>fa-external-link-alt</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    to: {
      required: true,
    },
    newTab: {
      default: false,
    },
  },
};
</script>

<style>
</style>