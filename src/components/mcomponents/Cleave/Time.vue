<template>
  <v-text-field
    v-model="localValue"
    @input="change"
    dir="ltr"
    :placeholder="placeholder"
    :disabled="disabled"
    append-icon="fa-clock"
    @click:append="setToday"
    clearable
    style="min-width: 90px"
  />
</template>

<script>
import Cleave from "cleave.js";
import moment from "moment-jalaali";
import IMask from "imask";

export default {
  name: "Date",
  props: ["value", "id", "default", "disabled", "placeholder"],
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
      this.change();
    }
  },
  created() {
    this.mask = IMask.createMask({
      mask: "HH:MM",
      blocks: {
        HH: {
          mask: IMask.MaskedRange,
          from: 0,
          to: 23
        },
        MM: {
          mask: IMask.MaskedRange,
          from: 0,
          to: 59
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
        this.$emit("input", this.mask.value);
      }
    },
    setToday() {
      this.localValue = this.now.format("HH:mm");
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
