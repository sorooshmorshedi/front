<template>
<input type="text" name="" value="" @input="change()" :id="inputId ">
</template>

<script>
import Cleave from 'cleave.js';
export default {
  name: 'CleaveMoney',
  props: ['value', 'id'],
  data() {
    return {
      inputId: '',
      formattedChangeLimit: 3,
      options: {
        numeral: true,
        numeralDecimalScale: 0,
      }
    }
  },
  created() {
    if (this.id) {
      this.inputId = this.id;
    } else {
      this.inputId = 'cleave' + (Math.random() * 100000).toFixed(0);
    }
  },
  mounted() {
    this.cleave = new Cleave('#' + this.inputId, this.options)
    this.cleave.setRawValue(this.value);
  },
  watch: {
    value() {
      this.cleave.setRawValue(this.value);
    }
  },
  methods: {
    change() {
      let value = this.cleave.getRawValue();
      this.$emit('input', value);
    }
  }

}
</script>

<style lang="css" scoped>
input {
}
</style>
