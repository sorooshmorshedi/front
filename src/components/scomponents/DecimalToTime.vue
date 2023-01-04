<template>
  <v-text-field
    dir="ltr"
    :label="label"
    :placeholder="placeholder"
    @input="change"
    :disabled="true"
    v-model="formattedAmount"
    class="currency-input"
    :smaller-font="formattedAmount.length > 14"
    style="min-width: 80px;"
    v-bind="$attrs"
    append-icon="fa-clock"
    v-on="listeners"
    autocomplete="off"
  >
    <template #append>
      <!-- <span class="py-1">ریال</span> -->
    </template>
  </v-text-field>
</template>

<script>
import Cleave from "cleave.js";
export default {
  name: "CleaveIntToTime",
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
    this.setAmount(this.value);
  },
  watch: {
    value() {
      if (this.value != this.getAmount()) this.setAmount(this.value);
    },
  },
  methods: {
    setAmount(value) {
      console.log(value)
      if (!value) value = "00:00";
      else {
        let numeric_value = Number(value);
        numeric_value = Number(numeric_value.toFixed(this.decimalScale));
        if (!isNaN(numeric_value)) value = numeric_value.toString();
        else value = String(value);
      }

      let valueParts = value.split(".");

      let hour = valueParts[0]
      let minute = Math.round((value - parseInt(valueParts[0])) * 60)
      if (minute && hour){
      this.formattedAmount = hour + ':' + minute
      } else if (hour && !minute) {
        this.formattedAmount = hour + ':00'
      } else if (minute && !hour) {
        this.formattedAmount = '00:' + minute
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
