<template>
  <vue-multiselect select-label="" select-group-label="" selected-label="" deselect-label="" deselect-group-label="" placeholder="انتخاب کنید" dir="rtl" :options="options" v-model="localValue" :track-by="trackBy" :label="label" @input="change" />

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

<style lang="css" scoped>
input {
  direction: ltr;
  text-align: left;
}
</style>
