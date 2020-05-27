<template>
  <v-text-field
    dir="ltr"
    :label="label"
    @input="change"
    :disabled="disabled"
    v-model="formattedAmount"
    class="currency-input"
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
    disabled: {
      default: false
    }
  },
  data() {
    return {
      formattedAmount: "",
      options: {
        numeral: true,
        numeralThousandsGroupStyle: "thousand",
        numeralDecimalScale: this.decimalScale
      }
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
      value = value || "";
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
  }
}
</style>
