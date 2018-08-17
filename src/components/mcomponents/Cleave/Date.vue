<template>
  <input type="text" name="" value="" @input="change()" :id="inputId" dir="ltr">
</template>

<script>
import Cleave from "cleave.js";
import moment from "moment-jalaali";
export default {
  name: "CleaveDate",
  props: ["value", "id", "defaultDate"],
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
    this.cleave.setRawValue(this.value);
    console.log(this.defaultDate);
    if (this.defaultDate) {
      let now = moment()
        .format("jYYYY-jMM-jDD")
        .split("-")
        .join("");
      console.log(now);
      this.cleave.setRawValue(now);
      this.change();
    }
  },
  watch: {
    value() {
      if (!this.value && this.defaultDate) {
        this.change();
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
    }
  }
};
</script>

<style lang="css" scoped>
input {
  direction: ltr;
}
</style>
