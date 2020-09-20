<template>
  <span>
    <v-file-input
      v-if="hasAttachment"
      clearable
      :show-size="true"
      :disabled="disabled"
      truncate-length
      :value="value"
      @change="(newValue) => file = newValue"
    />
    <template v-else>
      <v-btn icon :href="value" target="_blank" tag="a" rel="noopener noreferrer">
        <v-icon>fa-download</v-icon>
      </v-btn>
      <v-btn icon @click="deleteAttachment()" :disabled="disabled">
        <v-icon>fa-times</v-icon>
      </v-btn>
    </template>
  </span>
</template>

<script>
export default {
  name: "MFileInput",
  props: {
    value: {},
    disabled: { default: false },
  },
  data() {
    return {
      file: null,
    };
  },
  computed: {
    hasAttachment() {
      return typeof this.value != typeof "";
    },
  },
  watch: {
    file() {
      this.$emit("input", this.file);
    },
  },
  methods: {
    deleteAttachment() {
      this.file = null;
      this.$emit("input", null);
      this.$emit("update:delete-attachment", true);
    },
  },
};
</script>

<style lang="scss" scoped></style>
