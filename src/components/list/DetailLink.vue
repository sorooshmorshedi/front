<template>
  <v-tooltip bottom color="info">
    <template v-slot:activator="{ on, attrs }">

      <v-btn v-bind="attrs"
             v-on="on"
             color="info white--text" :to="to" icon :target="target">
        <v-icon>fa-info-circle</v-icon>
      </v-btn>
    </template>
    رفتن به جزئیات
  </v-tooltip>

</template>

<script>
export default {
  props: {
    to: {
      required: true,
    },
    target: {
      default: '_blank',
    },
  },
};
</script>

<style>
</style>