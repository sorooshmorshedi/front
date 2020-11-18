<template>
  <v-textarea
    :value="value"
    @input="value => $emit('input', value)"
    v-bind="$attrs"
    :prepend-inner-icon="i != 0?'$curvedArrowLeftIcon':'far fa-clone'"
    :append-icon="i == 0?'':''"
    @click:prepend-inner="$emit('updateRowsExplanation', i)"
  ></v-textarea>
</template>

<script>
export default {
  name: "MTextarea",
  props: {
    value: {},
    i: {
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>