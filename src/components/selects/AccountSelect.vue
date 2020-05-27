<template>
  <v-autocomplete
    :items="items"
    v-model="item"
    :label="label"
    :item-text="itemText"
    :disabled="disabled"
    :multiple="multiple"
    height="40"
  ></v-autocomplete>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
export default {
  mixins: [accountApiMixin],
  props: {
    value: {},
    label: {
      default: "حساب"
    },
    disabled: {
      default: false
    },
    itemText: {
      default: "title"
    },
    multiple: {
      default: false,
    },
    itemsType: {
      default: "all",
      validator(value) {
        return [
          "all",
          "level0",
          "level1",
          "level2",
          "level3",
          "persons",
          "buyers",
          "sellers",
          "banks",

          "floatAccounts",
          "floatAccountGroups",

          "costCenters",
          "costCenterGroups"
        ].includes(value);
      }
    }
  },
  data() {
    return {
      item: null
    };
  },
  computed: {
    items() {
      let items = [];

      if (this.itemsType == "floatAccounts") {
        items = this.floatAccounts.filter(o => o.is_cost_center == false);
      }

      if (this.itemsType == "floatAccountGroups") {
        items = this.floatAccountGroups.filter(o => o.is_cost_center == false);
      }

      if (this.itemsType == "costCenters") {
        items = this.floatAccounts.filter(o => o.is_cost_center == true);
      }

      if (this.itemsType == "costCenterGroups") {
        items = this.floatAccountGroups.filter(o => o.is_cost_center == true);
      }

      !items.length &&
        this.accounts.forEach(item => {
          if (this.itemsType == "all") {
            items.push(item);
          }

          if (this.itemsType.includes("level")) {
            let level = this.itemsType[this.itemsType.length - 1];
            if (item.level == level) {
              items.push(item);
            }
          }

          if (this.itemsType == "person") {
            if (item.account_type == "p") {
              items.push(item);
            }
          }

          if (this.itemsType == "buyers") {
            if (item.person_type == "buyer") {
              items.push(item);
            }
          }

          if (this.itemsType == "sellers") {
            if (item.person_type == "seller") {
              items.push(item);
            }
          }

          if (this.itemsType == "bank") {
            if (item.account_type == "b") {
              items.push(item);
            }
          }
        });

      return items;
    }
  },
  created() {
    this.getAccounts();
    this.setItem();
  },
  methods: {
    setItem(value) {
      if (this.value != this.item) this.item = this.value;
    }
  },
  watch: {
    value() {
      this.setItem(this.value);
    },
    item() {
      this.$emit("input", this.item);
    }
  }
};
</script>

<style lang="scss" >
</style>
