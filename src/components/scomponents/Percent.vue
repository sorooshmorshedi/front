<template>
  <v-text-field
      dir="ltr"
      :label="label"
      :placeholder="placeholder"
      @change="change"
      :disabled="disabled"
      v-on:keypress="NumbersOnly"
      v-model="formattedAmount"
      class="currency-input"
      append-icon="%"
      :smaller-font="formattedAmount.length > 14"
      style="min-width: 80px;"
      v-bind="$attrs"
      v-on="listeners"
      autocomplete="off"
  >
    <template #append>
      <!-- <span class="py-1">%</span> -->
    </template>
  </v-text-field>
</template>

<script>
import Cleave from "cleave.js";
export default {
  name: "CleavePercent",
  props: {
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
      let listeners = { ...this.$listeners };
      delete listeners.input;
      return listeners;
    },
  },
  mounted() {
    this.setFirstAmount(this.value);
  },
  watch: {
    value() {
      if (this.value != this.getAmount()) this.setFirstAmount(this.value);
    },
  },
  methods: {
    setAmount(value) {
      if (!value) value = 0;
      else {
      this.formattedAmount = value  ;
      }
    },
    setFirstAmount(value) {
      if (value == undefined) {
        value = 0
      }
      this.formattedAmount = value * 100;
      return value * 100
    },
    getAmount() {
      return this.formattedAmount / 100
    },
    change(newValue) {
      this.setAmount(newValue);
      this.$emit("input", this.getAmount());
    },
    NumbersOnly(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();;
      } else {
        return true;
      }
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
