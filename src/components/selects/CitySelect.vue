<template>
  <div class="d-flex">
    <v-autocomplete
      :items="items"
      v-model="item"
      :label="label"
      item-text="name"
      item-value="id"
      :disabled="disabled"
      :multiple="multiple"
      :placeholder="placeholder"
      :return-object="true"
      :rules="[rules.required]"
    ></v-autocomplete>
  </div>
</template>

<script>
import GetCitiesApi from "@/views/panel/city/getCitiesApi";
export default {
  mixins: [GetCitiesApi],
  props: {
    value: {},
    label: {
      default: null
    },
    placeholder: {
      default: null
    },
    disabled: {
      default: false
    },
    multiple: {
      default: false
    }
  },
  data() {
    return {
      item: null,
      rules: {
        required: value => !!value || 'Required.',
      },

    };
  },
  computed: {
    items() {
      return this.$store.state.cities;
    }
  },
  created() {
    this.getCities();
  },
  mounted(){
    this.setItem();
  },
  methods: {
    setItem() {
      if (this.value != this.item) this.item = this.value;
    }
  },
  watch: {
    value() {
      this.setItem();
    },
    item() {
      this.$emit("input", this.item);
    }
  }
};
</script>

<style lang="scss" scoped></style>