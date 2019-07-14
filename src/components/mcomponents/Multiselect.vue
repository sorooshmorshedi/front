<template>
  <div class="m-multiselect-container" :class="containerClasses">
    <div class="addon-btn-wrapper">
      <slot name="addonBtn" />
    </div>
    <div class="select-container">
      <vue-multiselect
        :multiple="multiple"
        :disabled="disabled"
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
        @select="select"
      >
        <span slot="noResult">نتیجه ای یافت نشد</span>
        <span slot="noOptions">لیست خالی است</span>
      </vue-multiselect>
    </div>
  </div>
</template>

<script>
import vueMultiselect from "vue-multiselect";
export default {
  name: "Multiselect",
  components: { vueMultiselect },
  props: [
    "value",
    "options",
    "trackBy",
    "label",
    "multiple",
    "disabled",
    "hasAddonBtn"
  ],
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
    },
    select(selectedOption, id) {
      this.$emit("select", selectedOption, id);
    }
  },
  computed: {
    containerClasses() {
      return {
        "has-addon-btn": this.hasAddonBtn
      };
    }
  }
};
</script>

<style lang="scss">
.m-multiselect-container {
  input {
    direction: rtl;
    text-align: right;
  }
  .multiselect {
    text-align: right;
  }

  &.has-addon-btn {
    width: 280px;
    .multiselect__tags {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
    .select-container {
      width: 240px;
      float: right;
    }
    .addon-btn-wrapper {
      button {
        display: block;
        width: 40px;
        height: 30px;
        border: none;
        float: right;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}
</style>
