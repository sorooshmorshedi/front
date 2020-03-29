<template>
  <input dir="ltr" type="text" name value @input="change()" :id="inputId">
</template>

<script>
import Cleave from "cleave.js";
export default {
  name: "CleaveMoney",
  props: {
    value: {},
    id: {},
    decimalScale: {
      default: 0
    }
  },
  data() {
    return {
      inputId: "",
      options: {
        numeral: true,
        numeralThousandsGroupStyle: "thousand",
        numeralDecimalScale: this.decimalScale
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
    let value = Number(this.value);
    this.cleave.setRawValue(value);
  },
  watch: {
    value() {
      let value = Number(this.value);
      this.cleave.setRawValue(value);
    }
  },
  methods: {
    change() {
      let value = Number(this.cleave.getRawValue());
      this.$emit("input", value);
    }
  }
};
</script>

<style lang="css" scoped>
input {
  direction: ltr;
  text-align: left;
}
</style>
