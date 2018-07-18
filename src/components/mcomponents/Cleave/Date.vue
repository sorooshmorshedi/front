<template>
  <input type="text" name="" value="" @input="change()" :id="inputId" dir="ltr">
</template>

<script>
import Cleave from "cleave.js";
export default {
  name: "CleaveDate",
  props: ["value", "id"],
  data() {
    return {
      inputId: "",
      formattedChangeLimit: 3,
      options: {
        date: true,
        datePattern: ["Y", "m", "d"]
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
    this.cleave.setRawValue(this.value);
  },
  watch: {
    value() {
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
    }
  }
};
</script>

<style lang="css" scoped>
input {
  direction: ltr;
}
</style>
