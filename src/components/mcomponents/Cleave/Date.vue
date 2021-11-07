<template>
  <span>
    <v-text-field
      v-model="localValue"
      @input="change"
      dir="ltr"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      clearable
      style="min-width: 140px"
      v-bind="$attrs"
      @click:clear="isDirty = true"
      :id="id"
    >
      <template #append>
        <v-icon
          class="mt-1"
          @click="$refs.datepicker.visible = true"
          @contextmenu.prevent="setToday"
          >fa-calendar-day</v-icon
        >
      </template>
    </v-text-field>
    <vue-persian-datetime-picker
      v-model="localValue"
      @input="change"
      ref="datepicker"
      :element="id"
      :editable="true"
      format="jYYYY-jMM-jDD"
    />
  </span>
</template>

<script>
import IMask from "imask";
import VuePersianDatetimePicker from "vue-persian-datetime-picker";

export default {
  name: "Date",
  props: ["value", "default", "disabled", "placeholder", "label"],
  components: { VuePersianDatetimePicker },
  data() {
    return {
      localValue: null,
      mask: null,
      isDirty: false,
      id: "date" + (Math.random() * 100000).toFixed(0),
    };
  },
  watch: {
    value() {
      this.localValue = this.value;

      if (this.localValue == undefined && this.default && !this.isDirty) {
        this.setToday();
      }
    },
  },
  created() {
    this.mask = IMask.createMask({
      mask: "YYYY-MM-DD",
      lazy: true,
      blocks: {
        YYYY: {
          mask: "0000",
        },
        MM: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12,
        },
        DD: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 31,
        },
      },
    });
  },
  mounted() {
    if (this.default && !this.value && !this.isDirty) {
      this.setToday();
    } else {
      this.localValue = this.value;
    }
  },
  methods: {
    change() {
      this.isDirty = true;
      if (this.localValue != this.value) {
        this.mask.resolve(String(this.localValue));
        this.$nextTick(() => {
          let maskedValue = this.mask.value;
          if (maskedValue == "") maskedValue = null;
          this.localValue = maskedValue;
          this.$emit("input", maskedValue);
        });
      }
    },
    setToday() {
      this.isDirty = true;
      this.localValue = this.serverNow.format("jYYYY-jMM-jDD");
      this.change();
      this.$emit("input", this.mask.value);
    },
  },
};
</script>

<style lang="css">
input {
  direction: ltr;
}
</style>
