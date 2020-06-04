<template>
  <v-text-field
    type="text"
    @input="change()"
    :id="inputId"
    dir="ltr"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
  />
</template>

<script>
import Cleave from "cleave.js";
import moment from "moment-jalaali";
export default {
  name: "CleaveDate",
  props: ["value", "id", "default", "label", "disabled", "placeholder"],
  data() {
    return {
      inputId: "",
      formattedChangeLimit: 3,
      options: {
        date: true,
        datePattern: ["Y", "m", "d"],
        delimiter: "-"
      }
    };
  },
  created() {
    if (this.id) {
      this.inputId = this.id;
    } else {
      this.inputId = "cleave" + (Math.random() * 100000).toFixed(0);
    }
  },
  mounted() {
    this.cleave = new Cleave("#" + this.inputId, this.options);
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
      if (this.cleave.getRawValue() != this.value) {
        this.cleave.setRawValue(this.value);
      }
    }
  },
  methods: {
    change() {
      setTimeout(() => {
        let value = $("#" + this.inputId).val();
        this.$emit("input", value);
      }, 100);
    },
    setDefaultValue() {
      let now = this.now
        .format("jYYYY-jMM-jDD")
        .split("-")
        .join("");
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
