<template>
<input type="text" class="form-control" name="" value="" @input="change()" :id="inputId ">
</template>

<script>
import Cleave from 'cleave.js';
export default {
  name: 'Cleave',
  props: ['value', 'raw', 'options', 'id'],
  data() {
    return {
      inputId: '',
      formattedChangeLimit: 3,
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
    if (this.raw) {
      this.cleave.setRawValue(this.raw);
    } else {
      $('#' + this.inputId).val(this.value);
    }
  },
  watch: {
    value() {
      if (this.raw) {
        this.cleave.setRawValue(this.raw);
      } else {
        if(this.formattedChangeLimit){
            $('#' + this.inputId).val(this.value);
            this.formattedChangeLimit -= 1;
        }
      }
    }
  },
  methods: {
    change() {
      let value = this.cleave.getRawValue();
      let emiteValue;
      if (value == this.options.prefix) {
        emiteValue = null;
      } else {
        if (this.raw) {
          emiteValue = value;
        } else {
          emiteValue = this.cleave.getFormattedValue();
        }
      }
      this.$emit('input', emiteValue);

    }
  }

}
</script>

<style lang="css" scoped>
input {
  direction: ltr;
  text-align: left;
}
</style>
