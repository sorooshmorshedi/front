<template>
  <input type="text" name="" value="" @input="change()" :id="inputId" dir="ltr">
</template>

<script>
import Cleave from "cleave.js";
import moment from "moment-jalaali";
export default {
  name: "CleaveTime",
  props: ["value", "id", "default"],
  data() {
    return {
      inputId: "",
      formattedChangeLimit: 3,
      options: {
        time: true,
        timePattern: ["h", "m"]
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
      if (this.value && this.cleave.getRawValue() != this.value) {
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
    setDefaultValue(){
      let now = moment().format("HHmm");
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
