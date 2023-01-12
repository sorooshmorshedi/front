<template>
  <v-text-field
      v-model="localValue"
      @input="change"
      dir="ltr"
      :label="label"
      :disabled="disabled"
      @click:append="setZero"
      style="min-width: 50px"
  />
</template>

<script>
import Cleave from "cleave.js";
import moment from "moment-jalaali";
import IMask from "imask";

export default {
  name: "HourPicker",
  props: {
    value: {},
    id: {},
    default: {},
    disabled: {},
    placeholder: {},
    label: {
      default: 'ساعت'
    },
  },
  data() {
    return {
      localValue: null,
      mask: null,
      isDirty: false,
    };
  },
  watch: {
    value() {
      this.localValue = this.value;
      if (this.localValue == undefined) {
        this.setZero();
      }
      this.change();
    },
  },
  created() {
    this.mask = IMask.createMask({
      mask: "HH:MM",
      blocks: {
        HH: {
          mask: IMask.MaskedRange,
          from: 0,
          to: 99,
        },
        MM: {
          mask: IMask.MaskedRange,
          from: 0,
          to: 59,
        },
      },
    });
  },
  mounted() {
    if (this.default) {
      this.setZero();
    } else {
      this.localValue = this.value;
    }
  },
  methods: {
    change() {
      this.isDirty = true;
      if (this.localValue != this.mask.value) {
        this.mask.resolve(String(this.localValue));
        this.$nextTick(() => {
          this.localValue = this.mask.value;
        });
        this.$emit("input", this.mask.value);
      }
    },
    setZero() {
      this.localValue = '00:00';
      this.change();
      this.$emit("input", this.mask.value);
    },
  },
};
</script>

<style lang="css" scoped>
input {
  direction: ltr;
}
</style>
