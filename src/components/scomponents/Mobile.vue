<template>
  <v-text-field
      :rules="rul"
      dir="ltr"
      :label="label"
      :placeholder="placeholder"
      @input="change"
      :disabled="disabled"
      v-model="formattedAmount"
      class="currency-input rounded-lg"
      :smaller-font="formattedAmount.length > 14"
      style="min-width: 80px;"
      v-bind="$attrs"
      v-on="listeners"
      prepend-inner-icon="fa-mobile"
      autocomplete="off"
  >
    <template #append>
    </template>
  </v-text-field>
</template>

<script>
import Cleave from "cleave.js";

export default {
  name: "ClaveMobile",
  props: {
    value: {},
    decimalScale: {
      default: 0,
    },
    label: {},
    placeholder: {
      default: null,
    },
    disabled: {
      default: false,
    },
    rul: {
      default: null,
    },
  },
  data() {
    return {
      formattedAmount: "",
      rules: {
        required: value => !!value || 'Required.',
      }
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
    reverseString(str) {
      let newString = "";
      for (let i = str.length - 1; i >= 0; i--) {
        newString += str[i];
      }
      return newString;
    },
    setAmount(value) {
      if (!value) value = "";
      else {
        let numeric_value = Number(value);
        numeric_value = Number(numeric_value.toFixed(this.decimalScale));
        value = String(value);
      }
      let valueParts = value.split(".");

      value = valueParts[0].split("-").join("");
      let formattedAmount = value.toString()
      if (formattedAmount.length == 5) {
        formattedAmount = formattedAmount.slice(0, 4) + " " + formattedAmount.slice(4);

      } else if (formattedAmount.length == 9){
        formattedAmount = formattedAmount.slice(0, 8) + " " + formattedAmount.slice(8);
      } else if (formattedAmount.length == 12){
        formattedAmount = formattedAmount.slice(0, 11) + " " + formattedAmount.slice(11);
      }

      if (valueParts.length == 3) {
        formattedAmount = `${formattedAmount}.${valueParts[1].substr(0, 6)}`;
      }

      this.formattedAmount = formattedAmount;
    },
    getAmount() {
      let valueParts = this.formattedAmount.split(" ").join("")
      return valueParts
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
