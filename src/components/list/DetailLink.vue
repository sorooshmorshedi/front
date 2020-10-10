<template>
  <v-btn color="light-blue white--text" :to="to" icon>
    <v-icon>fa-external-link-alt</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    to: {
      required: true,
    },
  },
};
</script>

<style>
</style>