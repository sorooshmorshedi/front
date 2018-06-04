<template>
<input type="text" class="form-control" name="" value="" @input="change()" :id="inputId">
</template>

<script>
import moment from 'moment-jalali'
export default {
  name: 'Datepicker',
  props: ['value', 'options', 'id'],
  // props: ['value', 'id'],
  data() {
    return {
      inputId: '',
      updateLimit: 1,
      datepicker: null,
    }
  },
  created() {
    if (this.id) {
      this.inputId = this.id;
    } else {
      this.inputId = 'datepicker' + (Math.random() * 100000).toFixed(0);
    }
  },
  mounted() {
    let options = {
      ...this.options,
      onSelect: () => this.change(),
      onSet: () => this.change(),
      format: 'YYYY-MM-DD',
      persianDigit: false,
    }
    this.datepicker = $('#' + this.inputId).pDatepicker(options)

    let unix = this.getUnix();
    if (unix) {
      this.datepicker.setDate(this.getUnix())
    }

  },
  watch: {
    value() {
      if (this.datepicker && this.value != $('#' + this.inputId).val()) {
        let unix = this.getUnix();
        if (unix) {
          this.datepicker.setDate(this.getUnix())
        }
      }
    }
  },
  methods: {
    change() {
      this.$emit('input', $('#' + this.inputId).val());
      if (this.datepicker) {
        this.datepicker.hide();
      }
    },
    getUnix() {
      if (!this.value) {
        return;
      }
      let format = 'j' + JSON.parse(JSON.stringify(this.options.format));
      format = format.replace(/\//g, '/j');
      let value = persianToEnglish(this.value);
      let unix = moment(value, format).format('x');
      return unix;

      function persianToEnglish(value) {
        var newValue = "";
        for (var i = 0; i < value.length; i++) {
          var ch = value.charCodeAt(i);
          if (ch >= 1776 && ch <= 1785) // For Persian digits.
          {
            var newChar = ch - 1728;
            newValue = newValue + String.fromCharCode(newChar);
          } else if (ch >= 1632 && ch <= 1641) // For Arabic & Unix digits.
          {
            var newChar = ch - 1584;
            newValue = newValue + String.fromCharCode(newChar);
          } else
            newValue = newValue + String.fromCharCode(ch);
        }
        return newValue;
      }
    }
  },

}
</script>

<style lang="css" scoped>
input {
  direction: ltr;
  text-align: left;
}
</style>
