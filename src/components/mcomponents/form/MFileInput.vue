<template>
  <!-- 

  Usage:

    <m-file-input
      :disabled="!isEditing"
      v-model="rows[i].attachment"
      :delete-attachment.sync="rows[i].delete_attachment"
    />

  -->

  <span>
    <v-file-input
      v-if="hasAttachment"
      clearable
      :label="label"
      :show-size="true"
      :disabled="disabled"
      truncate-length
      @change="inputChanged"
    />
    <template v-else>
      <div class="d-flex justify-space-between mt-1 pr-2">
        <label class="ml-8 mt-1">{{ label }}</label>
        <div>
          <v-btn icon :href="value" target="_blank" tag="a" rel="noopener noreferrer">
            <v-icon>fa-download</v-icon>
          </v-btn>
          <v-btn icon @click="deleteAttachment()" :disabled="disabled">
            <v-icon>fa-times</v-icon>
          </v-btn>
        </div>
      </div>
    </template>
  </span>
</template>

<script>
export default {
  name: "MFileInput",
  props: {
    value: {},
    disabled: { default: false },
    label: {},
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
    inputChanged(file) {
      this.file = file;
    },
    deleteAttachment() {
      this.file = null;
      this.$emit("input", null);
      this.$emit("update:delete-attachment", true);
    },
  },
};
</script>

<style lang="scss" scoped></style>