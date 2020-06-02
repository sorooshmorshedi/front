<template>
  <v-text-field :label="label" @input="change()" ref="inputRef" dir="ltr"></v-text-field>
</template>

<script>
import Cleave from "cleave.js";
import moment from "moment-jalaali";
export default {
  name: "CleaveTime",
  props: ["value", "default", "label"],
  data() {
    return {
      el: null,
      formattedChangeLimit: 3,
      options: {
        time: true,
        timePattern: ["h", "m"]
      }
    };
  },
  mounted() {
    this.el = this.$refs.inputRef.$el.querySelector("input");
    this.cleave = new Cleave(this.el, this.options);
    if (this.default) {
      this.setDefaultValue();
    } else {
      this.cleave.setRawValue(this.value);
    }
  },
  watch: {
    value() {
      if (!this.value && this.default) {
        this.setDefaultValue();
        return;
      }
      if (this.value && this.cleave.getRawValue() != this.value) {
        this.cleave.setRawValue(this.value);
      }
    }
  },
  methods: {
    change() {
      setTimeout(() => {
        let value = this.el.value;
        this.$emit("input", value);
      }, 100);
    },
    setDefaultValue() {
      let now = this.now.format("HHmm");
      this.cleave.setRawValue(now);
      this.change();
    }
  }
};
</script>

<style lang="css" scoped>
input {
  direction: ltr;
}
</style>
