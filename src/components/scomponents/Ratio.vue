<template>
  <v-text-field
      dir="ltr"
      :label="label"
      :placeholder="placeholder"
      @input="change"
      :disabled="disabled"
      v-model="formattedAmount"
      append-icon="fas fa-sun"
      class="currency-input rounded-lg"
      :smaller-font="formattedAmount.length > 14"
      style="min-width: 80px;"
      v-bind="$attrs"
      v-on="listeners"
      autocomplete="off"
  >
  </v-text-field>
</template>

<script>
import Cleave from "cleave.js";

export default {
  name: "CleaveRatio",
  props: {
    icon: null,
    value: {},
    decimalScale: {
      default: 6,
    },
    label: {},
    placeholder: {
      default: null,
    },
    disabled: {
      default: false,
    },
  },
  data() {
    return {
      formattedAmount: "",
    };
  },
  computed: {
    listeners() {
      let listeners = {...this.$listeners};
      delete listeners.input;
      return listeners;
    },
  },
  mounted() {
    this.setAmount(this.value);
  },
  watch: {
    value() {
      if (this.value != this.getAmount()) this.setAmount(this.value);
    },
  },
  methods: {
    setAmount(value) {
      if (!value) value = "";
      else {
        let numeric_value = Number(value);
        numeric_value = Number(numeric_value.toFixed(this.decimalScale));
        if (!isNaN(numeric_value)) value = numeric_value.toString();
        else value = String(value);
      }

      let valueParts = value.split(".");

      value = valueParts[0].split(",").join("");
      let formattedAmount = value
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      if (valueParts.length == 2) {
        formattedAmount = `${formattedAmount}.${valueParts[1].substr(0, 6)}`;
      }

      this.formattedAmount = formattedAmount;
    },
    getAmount() {
      let valueParts = this.formattedAmount.split(",").join("").split(".");
      if (valueParts.length == 2) {
        return `${valueParts[0]}.${valueParts[1].substr(0, 6)}`;
      }
      let value = valueParts[0];
      if (value == "") {
        return null;
      } else {
        return +value;
      }
    },
    change(newValue) {
      this.setAmount(newValue);
      this.$emit("input", this.getAmount());
    },
  },
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
