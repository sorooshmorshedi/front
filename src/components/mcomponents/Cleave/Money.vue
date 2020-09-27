<template>
  <v-text-field
    dir="ltr"
    :label="label"
    :placeholder="placeholder"
    @input="change"
    :disabled="disabled"
    v-model="formattedAmount"
    class="currency-input"
    :smaller-font="formattedAmount.length > 14"
    style="min-width: 90px;"
    v-bind="$attrs"
  >
    <template #append>
      <!-- <span class="py-1">ریال</span> -->
    </template>
  </v-text-field>
</template>

<script>
import Cleave from "cleave.js";
export default {
  name: "CleaveMoney",
  props: {
    value: {},
    decimalScale: {
      default: 0
    },
    label: {},
    placeholder: {
      default: null
    },
    disabled: {
      default: false
    }
  },
  data() {
    return {
      formattedAmount: ""
    };
  },
  mounted() {
    this.setAmount(this.value);
  },
  watch: {
    value() {
      if (this.value != this.getAmount()) this.setAmount(this.value);
    }
  },
  methods: {
    setAmount(value) {
      if (!value) value = "";
      else {
        let numeric_value = Number(value);
        if (!isNaN(numeric_value)) value = String(numeric_value);
        else value = String(value);
      }

      value = value.split(",").join("");
      this.formattedAmount = value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getAmount() {
      return this.formattedAmount.split(",").join("");
    },
    change(newValue) {
      this.setAmount(newValue);
      this.$emit("input", this.getAmount());
    }
  }
};
</script>

<style lang="scss">
.currency-input {
  input {
    direction: ltr;
    text-align: center !important;

    &[smaller-font] {
      font-size: 10px !important;
    }
  }
}
</style>
