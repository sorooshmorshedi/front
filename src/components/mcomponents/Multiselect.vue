<template>
  <vue-multiselect
    select-label
    select-group-label
    selected-label
    deselect-label
    deselect-group-label
    placeholder="انتخاب کنید"
    dir="rtl"
    :options="options"
    v-model="localValue"
    :track-by="trackBy"
    :label="label"
    @input="change"
  >
    <span slot="noResult">نتیجه ای یافت نشد</span>
    <span slot="noOptions">لیست خالی است</span>
  </vue-multiselect>
</template>

<script>
import vueMultiselect from "vue-multiselect";
export default {
  name: "Multiselect",
  components: { vueMultiselect },
  props: ["value", "options", "trackBy", "label"],
  data() {
    return {
      localValue: null
    };
  },
  created() {
    this.setValue();
  },
  mounted() {},
  watch: {
    value() {
      this.setValue();
    }
  },
  methods: {
    setValue() {
      if (this.value != this.localValue) {
        this.localValue = this.value;
      }
    },
    change() {
      if (this.value != this.localValue) {
        this.$emit("input", this.localValue);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
input {
  direction: rtl;
  text-align: right;
}
.multiselect {
  text-align: right;
}
</style>
