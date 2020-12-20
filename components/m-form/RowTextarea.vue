<template>
  <v-textarea
    v-if="!$attrs.disabled"
    :value="value"
    @input="value => $emit('input', value)"
    v-bind="$attrs"
    :prepend-inner-icon="i != 0?'$curvedArrowLeftIcon':'far fa-clone'"
    :append-icon="i == 0?'':''"
    @click:prepend-inner="$emit('updateRowsExplanation', i)"
  />
  <div v-else v-tooltip="value">
    <v-textarea :value="limitedValue" v-bind="$attrs" disabled ref="textarea" />
  </div>
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
  data() {
    return {
      width: 80,
    };
  },
  computed: {
    limitedValue() {
      if (this.value) {
        console.log(this.width);
        return this.value.substr(0, this.width / 2.2) + "...";
      }
      return this.value;
    },
  },
  mounted() {
    if (this.$refs.textarea) {
      console.log(this.$refs.textarea.$vnode.elm.offsetWidth);
    }
  },
};
</script>

<style lang="scss" scoped></style>