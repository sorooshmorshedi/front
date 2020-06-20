<template>
  <v-text-field
    v-model="localValue"
    @input="change"
    dir="ltr"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    append-icon="fa-calendar-day"
    @click:append="setToday"
    clearable
    style="min-width: 140px"
  />
</template>

<script>
import Cleave from "cleave.js";
import moment from "moment-jalaali";
import IMask from "imask";

export default {
  name: "Date",
  props: ["value", "id", "default", "disabled", "placeholder", "label"],
  data() {
    return {
      localValue: null,
      mask: null,
      isDirty: false
    };
  },
  watch: {
    value() {
      this.localValue = this.value;
    }
  },
  created() {
    this.mask = IMask.createMask({
      mask: "YYYY-MM-DD",
      lazy: true,
      blocks: {
        YYYY: {
          mask: "0000"
        },
        MM: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12
        },
        DD: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 31
        }
      }
    });
  },
  mounted() {
    if (this.default) {
      this.setToday();
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
      }
    },
    setToday() {
      this.localValue = this.now.format("jYYYY-jMM-jDD");
      this.change();
      this.$emit("input", this.mask.value);
    }
  }
};
</script>

<style lang="css" scoped>
input {
  direction: ltr;
}
</style>
